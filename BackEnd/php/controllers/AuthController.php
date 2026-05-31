<?php

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    private function getDb()
    {
        return $this->container->get('db');
    }

    private function jsonResponse(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    /**
     * POST /register
     */
    public function register(Request $request, Response $response, array $args)
    {
        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';
        $ruolo = $data['ruolo'] ?? 'user'; // 'admin' o 'user'

        if (empty($username) || empty($password)) {
            return $this->jsonResponse($response, ["error" => "Dati incompleti"], 400);
        }

        $usersColl = $this->getDb()->selectCollection('users');
        
        // Verifica se lo username esiste già
        $existing = $usersColl->findOne(['username' => $username]);
        if ($existing) {
            return $this->jsonResponse($response, ["error" => "Username già utilizzato"], 400);
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        $usersColl->insertOne([
            'username' => $username,
            'password' => $hashedPassword,
            'ruolo' => $ruolo
        ]);

        return $this->jsonResponse($response, ["status" => "success", "message" => "Utente registrato!"], 201);
    }

    /**
     * POST /login
     */
    public function login(Request $request, Response $response, array $args)
    {
        $data = $request->getParsedBody() ?? json_decode((string)$request->getBody(), true);
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';

        $usersColl = $this->getDb()->selectCollection('users');
        $user = $usersColl->findOne(['username' => $username]);

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->jsonResponse($response, ["error" => "Credenziali errate"], 401);
        }

        // Configurazione delle Sessioni PHP (Vincolo traccia)
        $_SESSION['user_id'] = (string)$user['_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['ruolo'] = $user['ruolo'];

        return $this->jsonResponse($response, [
            "status" => "success",
            "username" => $user['username'],
            "ruolo" => $user['ruolo']
        ]);
    }

    /**
     * POST /logout
     */
    public function logout(Request $request, Response $response, array $args)
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy(); // Distrugge la sessione PHP (Vincolo traccia)
        }
        return $this->jsonResponse($response, ["status" => "success", "message" => "Logout effettuato"]);
    }

    /**
     * GET /check-session (Usato dall'AuthGuard di Angular)
     */
    public function checkSession(Request $request, Response $response, array $args)
    {
        if (isset($_SESSION['user_id'])) {
            return $this->jsonResponse($response, [
                "logged" => true,
                "username" => $_SESSION['username'],
                "ruolo" => $_SESSION['ruolo']
            ]);
        }
        return $this->jsonResponse($response, ["logged" => false], 401);
    }
}