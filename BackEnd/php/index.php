<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

use Psr\Container\ContainerInterface;
use Slim\Factory\AppFactory;
use MongoDB\Client;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/controllers/APIController.php';

// 1. Inizializzazione container
$container = new \DI\Container();

// 2. Registra la connessione MongoDB
$container->set('db', function (ContainerInterface $container) {
    //Usiamo 'mongodb' al posto di 'localhost' perché siamo dentro la rete Docker
    $uri = "mongodb://admin:password123@mongodb:27017";
    //$uri = "mongodb://localhost:27017"; 
    $client = new Client($uri);
    return $client->selectDatabase('bookShop');
});

// 3. Creazione app
AppFactory::setContainer($container);
$app = AppFactory::create();

// Rileva dinamicamente il percorso corretto dell'index.php eliminando i conflitti di routing
// $basePath = str_replace('/index.php', '', $_SERVER['SCRIPT_NAME']);
// $app->setBasePath($basePath);
$app->addBodyParsingMiddleware(); // per leggere i dati inviati (POST)
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

// --- ENDPOINT LIBRI ---

// 1. Lista libri
$app->get('/books', 'APIController:index');

// 2. Dettaglio singolo libro
$app->get('/books/{idBook}', 'APIController:show');

// 3. Statistiche della libreria
$app->get('/stats', 'APIController:getStats');

// 4. Salva un nuovo libro
$app->post('/books', 'APIController:store');

// 5. Modifica completa di un libro
$app->put('/books/{idBook}', 'APIController:update');

// 6. Cambia lo stato di lettura
$app->patch('/books/{idBook}/state', 'APIController:updateState');

// 7. Inserisce o rimuove dai preferiti
$app->patch('/books/{idBook}/favorite', 'APIController:toggleFavorite');

// 8. Elimina un libro
$app->delete('/books/{idBook}', 'APIController:delete');

$app->run();

