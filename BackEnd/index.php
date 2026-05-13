<?php
error_reporting(0);
header('Content-Type: application/json');
use Slim\Factory\AppFactory;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/controllers/APIController.php';

$app = AppFactory::create();


$app->get('/api/booklist', "APIController:index");


$app->run();
