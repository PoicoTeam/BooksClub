<?php
/*
  ENTRYPOINT PRINCIPALE - BooksClub Backend
  Gestisce le sessioni, i permessi CORS, la connessione al DB
  e lo smistamento di tutte le rotte API (Routing).
*/

// avvio sessione php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// per visualizzare gli errori (usato nella fase di sviluppo)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// configurazione header http (cors)
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

use Psr\Container\ContainerInterface;
use Slim\Factory\AppFactory;
use MongoDB\Client;

require __DIR__ . '/vendor/autoload.php';

// inclusione dei controller che contengono logica di business
require __DIR__ . '/controllers/AuthController.php';
require __DIR__ . '/controllers/APIController.php';

// container per gestire le dipendenze (dependency injection)
$container = new \DI\Container();

/*
  Configurazione del Database MongoDB
  Iniettiamo l'istanza del DB nel container per usarla nei controller
*/
$container->set('db', function (ContainerInterface $container) {
    $uri = "mongodb://admin:password123@mongodb:27017"; 
    $client = new Client($uri);
    return $client->selectDatabase('bookShop');
});

// inizializzazione dell'app Slim con il container configurato
AppFactory::setContainer($container);
$app = AppFactory::create();

// middleware
$app->addBodyParsingMiddleware(); 
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

// --- DEFINIZIONE DELLE ROTTE ---

/*
  ROTTE DI AUTENTICAZIONE (AuthController)
  Gestiscono la creazione dell'account, l'accesso e la sicurezza.
*/
$app->post('/register', 'AuthController:register');    // registrazione nuovo utente
$app->post('/login', 'AuthController:login');          // login 
$app->post('/logout', 'AuthController:logout');         // logout
$app->get('/check-session', 'AuthController:checkSession'); // verifica se l'utente è ancora loggato

/*
  ROTTE GESTIONE LIBRI (APIController)
  Operazioni CRUD (Create, Read, Update, Delete) sui libri dell'utente loggato.
*/
$app->get('/books', 'APIController:index');                 // lista libri 
$app->get('/books/{idBook}', 'APIController:show');         // dettaglio di un singolo libro
$app->get('/stats', 'APIController:getStats');              // statistiche 
$app->post('/books', 'APIController:store');                // aggiunta di un nuovo libro
$app->put('/books/{idBook}', 'APIController:update');       // modifica del libro
$app->patch('/books/{idBook}/state', 'APIController:updateState'); // cambio stato (es: da leggere)
$app->patch('/books/{idBook}/favorite', 'APIController:toggleFavorite'); // aggiungi/rimuovi dai preferiti
$app->delete('/books/{idBook}', 'APIController:delete');    // eliminazione libro

/*
  ROTTE AMMINISTRATORE (APIController)
  Funzioni riservate agli utenti con ruolo 'admin'.
*/
$app->get('/admin/stats', 'APIController:getAdminStats');    // numero utenti registrati 
$app->get('/admin/users', 'APIController:listUsers');        // lista di tutti gli utenti registrati
$app->delete('/admin/users/{idUser}', 'APIController:deleteUser'); // elimina un utente specifico
$app->delete('/admin/users', 'APIController:deleteAllUsers');      // cancellazione di tutti gli utenti
$app->patch('/admin/users/{idUser}/reset-password', 'APIController:resetPassword'); // reset password utente di default

$app->run();
