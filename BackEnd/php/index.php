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
    /*Usiamo 'mongodb' al posto di 'localhost' perché siamo dentro la rete Docker
    $uri = "mongodb://admin:password123@mongodb:27017";*/ 
    $uri = "mongodb://localhost:27017"; 
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

// Mostra la lista di tutti i libri 
$app->get('/list', 'APIController:index');

//Salva un nuovo libro 
$app->post('/add', 'APIController:store');

//  Elimina un libro dalla libreria
$app->post('/books/{idBook}/cancel', 'APIController:delete');

// Cambia lo stato di lettura del libro (es: passa da 'da_leggere' a 'letto')
$app->post('/books/{idBook}/state', 'APIController:updateState');

// Inserisce o rimuove il libro dai preferiti (true/false)
$app->post('/books/{idBook}/favorite', 'APIController:toggleFavorite');


$app->run();
