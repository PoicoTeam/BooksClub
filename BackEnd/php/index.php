<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

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

// Includiamo ENTRAMBI i controller
require __DIR__ . '/controllers/AuthController.php';
require __DIR__ . '/controllers/APIController.php';

$container = new \DI\Container();

$container->set('db', function (ContainerInterface $container) {
    $uri = "mongodb://admin:password123@mongodb:27017";
    $client = new Client($uri);
    return $client->selectDatabase('bookShop');
});

AppFactory::setContainer($container);
$app = AppFactory::create();

$app->addBodyParsingMiddleware(); 
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

// --- ROTTE DI AUTENTICAZIONE (Puntano a AuthController) ---
$app->post('/register', 'AuthController:register');
$app->post('/login', 'AuthController:login');
$app->post('/logout', 'AuthController:logout');
$app->get('/check-session', 'AuthController:checkSession');

// --- ROTTE LIBRI (Puntano a APIController) ---
$app->get('/books', 'APIController:index');
$app->get('/books/{idBook}', 'APIController:show');
$app->get('/stats', 'APIController:getStats');
$app->post('/books', 'APIController:store');
$app->put('/books/{idBook}', 'APIController:update');
$app->patch('/books/{idBook}/state', 'APIController:updateState');
$app->patch('/books/{idBook}/favorite', 'APIController:toggleFavorite');
$app->delete('/books/{idBook}', 'APIController:delete');

// --- ROTTE ADMIN (Puntano a APIController) ---
$app->get('/admin/stats', 'APIController:getAdminStats');
$app->get('/admin/users', 'APIController:listUsers');
$app->delete('/admin/users/{idUser}', 'APIController:deleteUser');
$app->delete('/admin/users', 'APIController:deleteAllUsers');
$app->patch('/admin/users/{idUser}/reset-password', 'APIController:resetPassword');

$app->run();