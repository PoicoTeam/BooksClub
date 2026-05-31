<?php

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class APIController
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    private function getCollection()
    {
        $db = $this->container->get('db');
        return $db->selectCollection('book');
    }

    /**
     * Helper per rispondere in JSON standardizzato
     */
    private function jsonResponse(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    /**
     * GET /books - Lista libri con filtri (stato, preferito) e ricerca testuale
     */
    public function index(Request $request, Response $response, array $args)
    {
        $collection = $this->getCollection();
        $queryParams = $request->getQueryParams();
        
        $filter = [];

        // Filtro per stato (letto / da_leggere / in_lettura)
        if (!empty($queryParams['stato'])) {
            $filter['stato'] = $queryParams['stato'];
        }

        // Filtro per preferiti (?preferito=1)
        if (isset($queryParams['preferito'])) {
            $filter['preferito'] = $queryParams['preferito'] === '1';
        }

        // Ricerca globale per Titolo o Autore (?q=Umberto+Eco)
        if (!empty($queryParams['q'])) {
            $searchRegex = new \MongoDB\BSON\Regex($queryParams['q'], 'i'); // 'i' sta per case-insensitive
            $filter['$or'] = [
                ['titolo' => $searchRegex],
                ['autore' => $searchRegex]
            ];
        }

        $cursor = $collection->find($filter, ['sort' => ['titolo' => 1]]); // Ordina per titolo A-Z
        $libri = iterator_to_array($cursor);

        $libriFormattati = array_map(function($libro) {
            if (isset($libro['_id'])) $libro['_id'] = (string) $libro['_id'];
            return $libro;
        }, $libri);

        return $this->jsonResponse($response, $libriFormattati);
    }

    /**
     * GET /books/{idBook} - Dettaglio singolo libro
     */
    public function show(Request $request, Response $response, array $args)
    {
        $id = $args['idBook'] ?? '';
        if (empty($id)) return $this->jsonResponse($response, ["error" => "ID mancante"], 400);

        $collection = $this->getCollection();
        $libro = $collection->findOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);

        if (!$libro) {
            return $this->jsonResponse($response, ["error" => "Libro non trovato"], 404);
        }

        $libro['_id'] = (string) $libro['_id'];
        return $this->jsonResponse($response, (array)$libro);
    }

    /**
     * POST /books - Inserimento libro
     */
    public function store(Request $request, Response $response, array $args)
    {
        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);

        $titolo = $data['titolo'] ?? '';
        $autore = $data['autore'] ?? '';

        if (empty($titolo) || empty($autore)) {
            return $this->jsonResponse($response, ["status" => "error", "message" => "Titolo e Autore obbligatori"], 400);
        }

        $collection = $this->getCollection();
        $result = $collection->insertOne([
            'titolo'      => $titolo,
            'autore'      => $autore,
            'anno'        => isset($data['anno']) ? (int)$data['anno'] : null,
            'img'         => $data['img'] ?? '',
            'editore'     => $data['editore'] ?? '',
            'isbn'        => $data['isbn'] ?? '',
            'descrizione' => $data['descrizione'] ?? '',
            'genere'      => $data['genere'] ?? '',
            'stato'       => $data['stato'] ?? 'da_leggere', // Default se non specificato
            'preferito'   => isset($data['preferito']) && ($data['preferito'] == true || $data['preferito'] == '1'),
            'voto'        => isset($data['voto']) ? (int)$data['voto'] : null, // Voto da 1 a 5 stelle opzionale
            'creato_il'   => new \MongoDB\BSON\UTCDateTime()
        ]);

        return $this->jsonResponse($response, [
            "status" => "success",
            "message" => "Libro salvato!",
            "id" => (string)$result->getInsertedId()
        ], 201);
    }

    /**
     * PUT /books/{idBook} - Modifica totale dati libro
     */
    public function update(Request $request, Response $response, array $args)
    {
        $id = $args['idBook'] ?? '';
        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);

        if (empty($id) || empty($data)) {
            return $this->jsonResponse($response, ["error" => "Dati o ID mancanti"], 400);
        }

        $collection = $this->getCollection();
        $updateData = [
            'titolo'      => $data['titolo'] ?? '',
            'autore'      => $data['autore'] ?? '',
            'anno'        => isset($data['anno']) ? (int)$data['anno'] : null,
            'img'         => $data['img'] ?? '',
            'editore'     => $data['editore'] ?? '',
            'isbn'        => $data['isbn'] ?? '',
            'descrizione' => $data['descrizione'] ?? '',
            'genere'      => $data['genere'] ?? '',
            'voto'        => isset($data['voto']) ? (int)$data['voto'] : null,
        ];

        $collection->updateOne(
            ['_id' => new \MongoDB\BSON\ObjectId($id)],
            ['$set' => $updateData]
        );

        return $this->jsonResponse($response, ["status" => "success", "message" => "Libro aggiornato con successo"]);
    }

    /**
     * PATCH /books/{idBook}/state - Cambia stato di lettura
     */
    public function updateState(Request $request, Response $response, array $args)
    { 
        $id = $args['idBook'] ?? '';
        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);
        $nuovoStato = $data['stato'] ?? ''; // letto, da_leggere, in_lettura

        if (empty($id) || empty($nuovoStato)) {
            return $this->jsonResponse($response, ["error" => "ID o Stato mancante"], 400);
        }

        $collection = $this->getCollection();
        $collection->updateOne(
            ['_id' => new \MongoDB\BSON\ObjectId($id)],
            ['$set' => ['stato' => $nuovoStato]]
        );
        
        return $this->jsonResponse($response, ["status" => "success", "message" => "Stato aggiornato in '$nuovoStato'"]);
    }

    /**
     * PATCH /books/{idBook}/favorite - Toggle preferiti
     */
    public function toggleFavorite(Request $request, Response $response, array $args)
    { 
        $id = $args['idBook'] ?? '';
        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);
        
        $isPreferito = isset($data['preferito']) && ($data['preferito'] == true || $data['preferito'] == '1');

        if (empty($id)) return $this->jsonResponse($response, ["error" => "ID mancante"], 400);

        $collection = $this->getCollection();
        $collection->updateOne(
            ['_id' => new \MongoDB\BSON\ObjectId($id)],
            ['$set' => ['preferito' => $isPreferito]]
        );
        
        return $this->jsonResponse($response, ["status" => "success", "message" => $isPreferito ? "Aggiunto ai preferiti" : "Rimosso dai preferiti"]);
    }

    /**
     * DELETE /books/{idBook} - Elimina libro
     */
    public function delete(Request $request, Response $response, array $args)
    {
        $id = $args['idBook'] ?? '';
        if (empty($id)) return $this->jsonResponse($response, ["error" => "ID mancante"], 400);

        $collection = $this->getCollection();
        $collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);
        
        return $this->jsonResponse($response, ["status" => "success", "message" => "Libro eliminato definitivo"]);
    }

    /**
     * GET /stats - Statistiche della libreria (Utilissimo per la dashboard)
     */
    public function getStats(Request $request, Response $response, array $args)
    {
        $collection = $this->getCollection();

        $totale      = $collection->countDocuments([]);
        $letti       = $collection->countDocuments(['stato' => 'letto']);
        $daLeggere   = $collection->countDocuments(['stato' => 'da_leggere']);
        $inLettura   = $collection->countDocuments(['stato' => 'in_lettura']);
        $preferiti   = $collection->countDocuments(['preferito' => true]);

        return $this->jsonResponse($response, [
            "totale_libri" => $totale,
            "letti"        => $letti,
            "da_leggere"   => $daLeggere,
            "in_lettura"   => $inLettura,
            "preferiti"    => $preferiti
        ]);
    }
}