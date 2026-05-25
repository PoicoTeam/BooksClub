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
    $uri = "mongodb://localhost:27017"; 
    $client = new Client($uri);
    return $client->selectDatabase('bookShop');
});

// 3. Creazione app
AppFactory::setContainer($container);
$app = AppFactory::create();

// Rileva dinamicamente il percorso corretto dell'index.php eliminando i conflitti di routing
$basePath = str_replace('/index.php', '', $_SERVER['SCRIPT_NAME']);
$app->setBasePath($basePath);
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

$app->get('/list', 'APIController:index');

$app->run();