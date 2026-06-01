<?php

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/*
  CONTROLLER API (APIController)
  Gestisce le logiche CRUD dei libri per i singoli utenti e le funzioni esclusive del pannello Admin.
*/
class APIController
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    // metodo per recuperare l'istanza del database MongoDB dal container
    private function getDb()
    {
        return $this->container->get('db');
    }

    /*
      metodo per standardizzare le risposte JSON inviate al frontend (Angular)
      configura il corpo della risposta, l'header JSON e lo status code HTTP.
    */
    private function jsonResponse(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    // helper per verificare se l'utente è loggato (recupera l'ID dalla sessione)
    private function getLoggedUserId()
    {
        return $_SESSION['user_id'] ?? null;
    }

    // helper per verificare se l'utente in sessione possiede il ruolo 'admin'
    private function isAdmin()
    {
        return isset($_SESSION['ruolo']) && $_SESSION['ruolo'] === 'admin';
    }

    // ==========================================
    // SEZIONE GESTIONE LIBRI (DATI UTENTE)
    // ==========================================

    /*
      GET /books
      Recupera la lista dei libri dell'utente con supporto a filtri e ricerca testuale.
    */
    public function index(Request $request, Response $response, array $args)
    {
        $userId = $this->getLoggedUserId();
        if (!$userId) return $this->jsonResponse($response, ["error" => "Non autorizzato"], 401);

        $collection = $this->getDb()->selectCollection('book');
        $queryParams = $request->getQueryParams();
        
        // vincolo di sicurezza: l'utente vede esclusivamente i propri dati
        $filter = ['utente_id' => $userId];

        if (!empty($queryParams['stato'])) {
            $filter['stato'] = $queryParams['stato'];
        }

        if (isset($queryParams['preferito'])) {
            $filter['preferito'] = $queryParams['preferito'] === '1';
        }

        if (!empty($queryParams['q'])) {
            $searchRegex = new \MongoDB\BSON\Regex($queryParams['q'], 'i');
            $filter['$or'] = [
                ['titolo' => $searchRegex],
                ['autore' => $searchRegex]
            ];
        }

        $cursor = $collection->find($filter, ['sort' => ['titolo' => 1]]);
        $libri = iterator_to_array($cursor);

        // converte gli ObjectId di MongoDB in stringhe standard per Angular
        $libriFormattati = array_map(function($libro) {
            if (isset($libro['_id'])) $libro['_id'] = (string) $libro['_id'];
            return $libro;
        }, $libri);

        return $this->jsonResponse($response, $libriFormattati);
    }

    /*
      GET /books/{idBook}
      Mostra i dettagli completi di un singolo libro specifico appartenente all'utente.
    */
    public function show(Request $request, Response $response, array $args)
    {
        $userId = $this->getLoggedUserId();
        $id = $args['idBook'] ?? '';
        if (!$userId) return $this->jsonResponse($response, ["error" => "Non autorizzato"], 401);

        $collection = $this->getDb()->selectCollection('book');
        
        // filtriamo sia per ID libro che per utente_id per sicurezza binaria
        $libro = $collection->findOne([
            '_id' => new \MongoDB\BSON\ObjectId($id),
            'utente_id' => $userId
        ]);

        if (!$libro) return $this->jsonResponse($response, ["error" => "Libro non trovato o non tuo"], 404);

        $libro['_id'] = (string) $libro['_id'];
        return $this->jsonResponse($response, (array)$libro);
    }

    /*
      POST /books
      salva un nuovo libro nel database associandolo indissolubilmente all'utente loggato
    */
    public function store(Request $request, Response $response, array $args)
    {
        $userId = $this->getLoggedUserId();
        if (!$userId) return $this->jsonResponse($response, ["error" => "Non autorizzato"], 401);

        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);
        $titolo = $data['titolo'] ?? '';
        $autore = $data['autore'] ?? '';

        if (empty($titolo) || empty($autore)) {
            return $this->jsonResponse($response, ["error" => "Titolo e Autore obbligatori"], 400);
        }

        $collection = $this->getDb()->selectCollection('book');
        
        // inserimento del documento NoSQL legato alla sessione utente
        $result = $collection->insertOne([
            'utente_id'   => $userId, 
            'titolo'      => $titolo,
            'autore'      => $autore,
            'anno'        => isset($data['anno']) ? (int)$data['anno'] : null,
            'editore'     => $data['editore'] ?? '',
            'isbn'        => $data['isbn'] ?? '',
            'descrizione' => $data['descrizione'] ?? '',
            'genere'      => $data['genere'] ?? '',
            'stato'       => $data['stato'] ?? 'da_leggere',
            'preferito'   => isset($data['preferito']) && ($data['preferito'] == true || $data['preferito'] == '1'),
            'voto'        => isset($data['voto']) ? (int)$data['voto'] : null,
            'creato_il'   => new \MongoDB\BSON\UTCDateTime()
        ]);

        return $this->jsonResponse($response, ["status" => "success", "id" => (string)$result->getInsertedId()], 201);
    }

    /*
      PUT /books/{idBook}
      esegue la modifica integrale di tutti i campi testuali del libro selezionato
    */
    public function update(Request $request, Response $response, array $args)
    {
        $userId = $this->getLoggedUserId();
        $id = $args['idBook'] ?? '';
        if (!$userId) return $this->jsonResponse($response, ["error" => "Non autorizzato"], 401);

        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);

        $collection = $this->getDb()->selectCollection('book');
        
        // aggiorna solo se ID libro e utente_id combaciano
        $collection->updateOne(
            ['_id' => new \MongoDB\BSON\ObjectId($id), 'utente_id' => $userId],
            ['$set' => [
                'titolo'      => $data['titolo'] ?? '',
                'autore'      => $data['autore'] ?? '',
                'anno'        => isset($data['anno']) ? (int)$data['anno'] : null,
                'editore'     => $data['editore'] ?? '',
                'isbn'        => $data['isbn'] ?? '',
                'descrizione' => $data['descrizione'] ?? '',
                'genere'      => $data['genere'] ?? '',
                'voto'        => isset($data['voto']) ? (int)$data['voto'] : null,
            ]]
        );

        return $this->jsonResponse($response, ["status" => "success", "message" => "Libro aggiornato"]);
    }

    // PATCH /books/{idBook}/state
    public function updateState(Request $request, Response $response, array $args)
    { 
        $userId = $this->getLoggedUserId();
        $id = $args['idBook'] ?? '';
        if (!$userId) return $this->jsonResponse($response, ["error" => "Non autorizzato"], 401);

        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);
        $nuovoStato = $data['stato'] ?? '';

        $collection = $this->getDb()->selectCollection('book');
        $collection->updateOne(
            ['_id' => new \MongoDB\BSON\ObjectId($id), 'utente_id' => $userId],
            ['$set' => ['stato' => $nuovoStato]]
        );
        
        return $this->jsonResponse($response, ["status" => "success"]);
    }

    // PATCH /books/{idBook}/favorite
    public function toggleFavorite(Request $request, Response $response, array $args)
    { 
        $userId = $this->getLoggedUserId();
        $id = $args['idBook'] ?? '';
        if (!$userId) return $this->jsonResponse($response, ["error" => "Non autorizzato"], 401);

        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);
        $isPreferito = isset($data['preferito']) && ($data['preferito'] == true || $data['preferito'] == '1');

        $collection = $this->getDb()->selectCollection('book');
        $collection->updateOne(
            ['_id' => new \MongoDB\BSON\ObjectId($id), 'utente_id' => $userId],
            ['$set' => ['preferito' => $isPreferito]]
        );
        
        return $this->jsonResponse($response, ["status" => "success"]);
    }

    // DELETE /books/{idBook}
    public function delete(Request $request, Response $response, array $args)
    {
        $userId = $this->getLoggedUserId();
        $id = $args['idBook'] ?? '';
        if (!$userId) return $this->jsonResponse($response, ["error" => "Non autorizzato"], 401);

        $collection = $this->getDb()->selectCollection('book');
        $collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id), 'utente_id' => $userId]);
        
        return $this->jsonResponse($response, ["status" => "success", "message" => "Libro eliminato"]);
    }

    /*
      GET /stats
      calcola i contatori statistici personali in tempo reale per la dashboard utente.
    */
    public function getStats(Request $request, Response $response, array $args)
    {
        $userId = $this->getLoggedUserId();
        if (!$userId) return $this->jsonResponse($response, ["error" => "Non autorizzato"], 401);

        $collection = $this->getDb()->selectCollection('book');

        return $this->jsonResponse($response, [
            "totale_libri" => $collection->countDocuments(['utente_id' => $userId]),
            "letti"        => $collection->countDocuments(['utente_id' => $userId, 'stato' => 'letto']),
            "da_leggere"   => $collection->countDocuments(['utente_id' => $userId, 'stato' => 'da_leggere']),
            "in_lettura"   => $collection->countDocuments(['utente_id' => $userId, 'stato' => 'in_lettura']),
            "preferiti"    => $collection->countDocuments(['utente_id' => $userId, 'preferito' => true])
        ]);
    }

    // SEZIONE VINCOLI ADMIN (PAGINA ADMIN)
    /*
      GET /admin/stats
      restituisce il numero totale di utenti registrati (escludendo gli admin)
    */
    public function getAdminStats(Request $request, Response $response, array $args)
    {
        if (!$this->isAdmin()) return $this->jsonResponse($response, ["error" => "Vietato ai non-admin"], 403);

        $usersColl = $this->getDb()->selectCollection('users');
        $totaleUtenti = $usersColl->countDocuments(['ruolo' => 'user']);

        return $this->jsonResponse($response, ["numero_utenti_registrati" => $totaleUtenti]);
    }

    /*
      GET /admin/users
      elenca tutti gli utenti con ruolo standard iscritti all'applicazione.
    */
    public function listUsers(Request $request, Response $response, array $args)
    {
        if (!$this->isAdmin()) return $this->jsonResponse($response, ["error" => "Vietato"], 403);

        $usersColl = $this->getDb()->selectCollection('users');
        $cursor = $usersColl->find(['ruolo' => 'user']);
        $utenti = iterator_to_array($cursor);

        $utentiFormattati = array_map(function($u) {
            return ['id' => (string)$u['_id'], 'username' => $u['username']];
        }, $utenti);

        return $this->jsonResponse($response, $utentiFormattati);
    }

    /*
      DELETE /admin/users/{idUser}
      elimina un utente e tutti i libri ad esso collegati (rimozione a cascata).
    */
    public function deleteUser(Request $request, Response $response, array $args)
    {
        if (!$this->isAdmin()) return $this->jsonResponse($response, ["error" => "Vietato"], 403);
        $idUser = $args['idUser'] ?? '';

        $db = $this->getDb();
        
        // 1 - cancella prima i libri associati all'utente 
        $db->selectCollection('book')->deleteMany(['utente_id' => $idUser]);
        
        // 2 - cancella l'utente dalla collezione users
        $db->selectCollection('users')->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($idUser)]);

        return $this->jsonResponse($response, ["status" => "success", "message" => "Utente e relativi dati eliminati"]);
    }

    /*
      DELETE /admin/users
      pulisce l'intero database eliminando tutti gli utenti normali e i loro cataloghi
    */
    public function deleteAllUsers(Request $request, Response $response, array $args)
    {
        if (!$this->isAdmin()) return $this->jsonResponse($response, ["error" => "Vietato"], 403);

        $db = $this->getDb();
        $usersColl = $db->selectCollection('users');
        
        // ciclo di pulizia dei cataloghi libri di ciascun utente standard
        $cursor = $usersColl->find(['ruolo' => 'user']);
        foreach ($cursor as $user) {
            $userIdStr = (string)$user['_id'];
            $db->selectCollection('book')->deleteMany(['utente_id' => $userIdStr]);
        }

        // cancella in blocco solo gli utenti, preservando l'admin
        $usersColl->deleteMany(['ruolo' => 'user']);

        return $this->jsonResponse($response, ["status" => "success", "message" => "Tutti gli utenti (tranne admin) e i loro dati eliminati"]);
    }

    /*
      PATCH /admin/users/{idUser}/reset-password
      resetta forzatamente la password di un utente impostandola al valore di default "1234@".
    */
    public function resetPassword(Request $request, Response $response, array $args)
    {
        if (!$this->isAdmin()) return $this->jsonResponse($response, ["error" => "Vietato"], 403);
        $idUser = $args['idUser'] ?? '';

        // reset a valore di default fisso cifrato con BCRYPT
        $defaultPasswordHashed = password_hash("1234@", PASSWORD_BCRYPT);

        $usersColl = $this->getDb()->selectCollection('users');
        $usersColl->updateOne(
            ['_id' => new \MongoDB\BSON\ObjectId($idUser)],
            ['$set' => ['password' => $defaultPasswordHashed]]
        );

        return $this->jsonResponse($response, ["status" => "success", "message" => "Password resettata a 1234@"]);
    }
}
