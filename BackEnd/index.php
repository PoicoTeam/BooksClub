<?php
error_reporting(0);
header('Content-Type: application/json');
use Slim\Factory\AppFactory;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app = AppFactory::create();


$app->run();
