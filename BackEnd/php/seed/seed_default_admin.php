<?php
/*
  SEED ADMIN PREDEFINITO (seed_default_admin.php)
  Crea l'utente amministratore di sviluppo se non esiste già nel database.
  Viene eseguito all'avvio del container PHP (vedi build/entrypoint-php.sh).
  Credenziali documentate in BackEnd/Readme.md
*/

require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

// credenziali admin di default (solo ambiente di sviluppo)
const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'Admin@1234';

// CORRETTO: Host impostato su 'my_mongodb', password su 'pass' e aggiunto '?authSource=admin'
$uri = getenv('MONGO_URI') ?: 'mongodb://admin:pass@my_mongodb:27017/?authSource=admin';
$dbName = getenv('MONGO_DB') ?: 'bookShop';

try {
    $client = new Client($uri);
    
    // Forziamo un comando rapido (ping) per verificare subito se i dati di login sono corretti
    $client->selectDatabase('admin')->command(['ping' => 1]);

    $users = $client->selectDatabase($dbName)->selectCollection('users');

    // evita duplicati: se admin esiste già non fare nulla
    $existing = $users->findOne(['username' => DEFAULT_ADMIN_USERNAME]);
    if ($existing) {
        echo "[seed] Admin predefinito già presente (" . DEFAULT_ADMIN_USERNAME . ").\n";
        exit(0);
    }

    // inserimento documento admin con password cifrata BCRYPT
    $users->insertOne([
        'username' => DEFAULT_ADMIN_USERNAME,
        'password' => password_hash(DEFAULT_ADMIN_PASSWORD, PASSWORD_BCRYPT),
        'ruolo' => 'admin',
        'seeded' => true,
    ]);

    echo "[seed] Admin predefinito creato: username=" . DEFAULT_ADMIN_USERNAME . "\n";
    exit(0);
} catch (Throwable $e) {
    fwrite(STDERR, "[seed] Errore: " . $e->getMessage() . "\n");
    exit(1); // Questo codice 1 dice all'entrypoint che la connessione è fallita, spingendolo a riprovare
}