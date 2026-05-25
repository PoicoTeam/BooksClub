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
}
