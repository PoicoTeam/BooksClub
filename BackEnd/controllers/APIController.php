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

    public function index(Request $request, Response $response, array $args)
    {
        // Collegamento al db e alla collezione book
        $db = $this->container->get('db');
        $collection = $db->selectCollection('book');

        // Salvare tutti i documenti in un cursor
        $cursor = $collection->find([]);

        // Trasformare il cursor in un array 
        $libri = iterator_to_array($cursor);


        // Response
        $response->getBody()->write(json_encode($libri));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function store(Request $request, Response $response, array $args)
    {
        // recupero i dati inviati dal POST
        $data = $request->getParsedBody();
        
        $titolo = $data['titolo'] ?? '';
        $autore = $data['autore'] ?? '';
        $anno = $data['anno'] ?? '';

        if(!empty($titolo) && !empty($autore)){
            $db = $this->container->get('db');
            $collection = $db->selectCollection('book');

            // inserimento in db
            $collection->insertOne([
                'titolo' => $titolo,
                'autore' => $autore,
                'anno' => (int)$anno
            ]);
        }

        // reindirizzamento alla home - '/'
        return $response->withHeader('Location', '/')->withStatus(302);

    }

    public function delete(Request $request, Response $response, array $args)
    {
        // recupero l'id dagli args dell'url
        $id = $args['idBook'] ?? '';

        if(!empty($id)) {
            $collection = $this->getCollection();

            // cancellazione del libro con id
            // MongoDB\BSON\ObjectId($id) - converte il testo dell'ID in un "oggetto speciale" riconosciuto da MongoDB per trovare il libro esatto
            $collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
        }
        
        // reindirizzamento alla home - '/'
        return $response->withHeader('Location', '/')->withStatus(302);
    }

    public function updateState(Request $request, Response $response, array $args)
    { 
       $id = $args['idBook'] ?? '';
       $data = $request->getParsedBody();
       $nuovoStato = $data['stato'] ?? ''; // riceve il valore letto/da_leggere

        if(!empty($id) && !empty($nuovoStato)) {
            $collection = $this->getCollection();

            // aggiornamento del campo 'stato' del libro selezionato
            $collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => ['stato' => $nuovoStato]]
            );
        }
        
        // reindirizzamento alla home - '/'
        return $response->withHeader('Location', '/')->withStatus(302);

    }

    public function toggleFavorite(Request $request, Response $response, array $args)
    { 
       $id = $args['idBook'] ?? '';
       $data = $request->getParsedBody();

        // Converte il valore del form in un vero bolleano (true/false)
        $isPreferito = isset($data['preferito']) && $data['preferito'] == '1';

        if(!empty($id)) {
            $collection = $this->getCollection();

            // aggiornamento del campo 'preferito' del libro selezionato
            $collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => ['preferito' => $isPreferito]]
            );
        }
        
        // reindirizzamento alla home - '/'
        return $response->withHeader('Location', '/')->withStatus(302);

    }
}
