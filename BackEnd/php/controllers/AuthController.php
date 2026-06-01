<?php

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
/*
  CONTROLLER DI AUTENTICAZIONE (AuthController)
  Gestisce la logica di registrazione, login, logout e controllo dello stato della sessione.
*/
class AuthController
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    
    //metodo per recuperare l'istanza del database MongoDB dal container
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

    // POST register
    public function register(Request $request, Response $response, array $args)
    {
        // recupera i dati inviati nel body della richiesta (gestisce sia form che JSON puro)
        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);
        
        
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';
        $ruolo = $data['ruolo'] ?? 'user'; // il ruolo di default è 'user' ('admin' è l'alternativa)

        // cantrollo dei campi obbligatori vuoti
        if (empty($username) || empty($password)) {
            return $this->jsonResponse($response, ["error" => "Dati incompleti"], 400);
        }

        // seleziona la collezione 'users' su MongoDB
        $usersColl = $this->getDb()->selectCollection('users');
        
        // verifica l'univocità dello username (query di ricerca su MongoDB)
        $existing = $usersColl->findOne(['username' => $username]);
        if ($existing) {
            return $this->jsonResponse($response, ["error" => "Username già utilizzato"], 400);
        }

        // cifratura della password usando l'algoritmo sicuro BCRYPT (genera un hash)
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // inserimento del nuovo documento utente nel database
        $usersColl->insertOne([
            'username' => $username,
            'password' => $hashedPassword,
            'ruolo' => $ruolo
        ]);

        // risposta di successo con HTTP Status 201 (Created)
        return $this->jsonResponse($response, ["status" => "success", "message" => "Utente registrato!"], 201);
    }

    //POST login
    public function login(Request $request, Response $response, array $args)
    {
        // estrae le credenziali dal body della richiesta
        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';

        // cerca l'utente nel database tramite lo username
        $usersColl = $this->getDb()->selectCollection('users');
        $user = $usersColl->findOne(['username' => $username]);

        // verifica se l'utente esiste e se la password inserita corrisponde all'hash memorizzato
        if (!$user || !password_verify($password, $user['password'])) {
            // se fallisce, restituisce 401 Unauthorized 
            return $this->jsonResponse($response, ["error" => "Credenziali errate"], 401);
        }

        // --- GESTIONE DELLA SESSIONE ---
        // se le credenziali sono corrette, salviamo i dati dell'utente nell'array globale $_SESSION.
        // questo genererà automaticamente il cookie PHPSESSID inviato al browser.
        $_SESSION['user_id'] = (string)$user['_id']; // converte l'ObjectId di MongoDB in stringa
        $_SESSION['username'] = $user['username'];
        $_SESSION['ruolo'] = $user['ruolo'];

        // Ritorna i dati dell'utente ad Angular
        return $this->jsonResponse($response, [
            "status" => "success",
            "username" => $user['username'],
            "ruolo" => $user['ruolo']
        ]);
    }


    // POST logout
    public function logout(Request $request, Response $response, array $args)
    {
        // controlla se esiste una sessione attiva prima di distruggerla
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy(); // cancella i dati sul server e invalida il cookie di sessione
        }
        return $this->jsonResponse($response, ["status" => "success", "message" => "Logout effettuato"]);
    }

    /*
     GET /check-session
     Endpoint fondamentale per l'AuthGuard di Angular.
     Viene chiamato ad ogni cambio pagina nel frontend per verificare se l'utente è loggato.
    */
    public function checkSession(Request $request, Response $response, array $args)
    {
        // verifica se nella sessione corrente è presente l'ID dell'utente
        if (isset($_SESSION['user_id'])) {
            // utente autenticato: restituisce i dati di sessione aggiornati
            return $this->jsonResponse($response, [
                "logged" => true,
                "username" => $_SESSION['username'],
                "ruolo" => $_SESSION['ruolo']
            ]);
        }
        
        // utente non autenticato o sessione scaduta: restituisce 401 Unauthorized
        return $this->jsonResponse($response, ["logged" => false], 401);
    }
}