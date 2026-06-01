# BooksClub - PHP & MongoDB Docker Suite (Angular Backend)

Questo progetto configura un ambiente di sviluppo completo per un'applicazione backend PHP 8.3 (Slim Framework) che comunica con un database NoSQL MongoDB, il tutto orchestrato con Docker. Il sistema è ingegnerizzato per fare da backend a un frontend in Angular, implementando il controllo degli accessi e la gestione dei dati per singolo utente tramite **Sessioni PHP native** e cookie, rispettando i vincoli di sicurezza del progetto.

---

## 🚀 Struttura del Progetto

```text
.
├── build/
│   ├── Dockerfile.php         # Configurazione immagine PHP + Driver Mongo
│   └── entrypoint-php.sh      # Script di avvio (composer install + Apache)
├── php/
│   ├── index.php              # Entrypoint dell'applicazione e routing Slim
│   └── controllers/
│       ├── AuthController.php # Registrazione, Login, Logout e controllo Sessione
│       └── APIController.php  # Gestione Libri personali e funzioni Pannello Admin
├── docker-compose.yml         # Orchestrazione dei servizi Docker
└── README.md
```

---

## 🛠️ Servizi Inclusi

### PHP 8.3 (Apache)

* Esposto sulla porta **8080**
* Include il driver nativo **MongoDB**
* Include **Composer**
* Gestisce lo stato e l'autenticazione tramite cookie di sessione (`PHPSESSID`)

### MongoDB 7.0

* Database principale NoSQL
* Esposto sulla porta **27017**
* Gestisce due collezioni principali: `users` e `book` (collegate logicamente tramite l'ID utente)

### Mongo Express

* Interfaccia grafica di gestione del database
* Disponibile su: http://localhost:8081

---

## ⚙️ Requisiti

* Docker installato sul PC
* Docker Compose attivo

---

## 🏁 Istruzioni per l'uso

### 1. Clonazione e Setup

Assicurati che lo script di entrypoint abbia i permessi di esecuzione e il formato corretto (**LF**):

```bash
chmod +x build/entrypoint-php.sh
```

### 2. Avvio dell'ambiente

Dalla root del progetto, esegui:

```bash
docker compose up -d --build
```

### 3. Accesso ai servizi

| Servizio               | URL                   |
| ---------------------- | --------------------- |
| Backend API (PHP Slim) | http://localhost:8080 |
| Pannello Mongo Express | http://localhost:8081 |

#### Credenziali di Default

**Mongo Express (Interfaccia web)**

```text
Username: admin
Password: pass
```

**MongoDB (Stringa di Connessione interna)**

```text
Username: admin
Password: password123
```

> ⚠️ Queste credenziali servono solo per **MongoDB / Mongo Express**, non per l’accesso all’app BooksClub.

---

## 👤 Account applicazione (utenti `users`)

Il backend **non crea automaticamente** un utente amministratore all’avvio di Docker.  
Ogni account (user o admin) va registrato tramite `POST /register` con il campo `ruolo`.

### Account admin consigliato per i test

Dopo `docker compose up`, crea un amministratore con una delle modalità sotto.

| Campo    | Valore suggerito   |
| -------- | ------------------ |
| Username | `admin_boss`       |
| Password | `superpassword`    |
| Ruolo    | `admin`            |

**Opzione A — Frontend Angular** (`http://localhost:4200/register`):

1. Compila username e password (es. tabella sopra).
2. In «Tipo account» seleziona **Amministratore — solo per test**.
3. Accedi da `/login` → verrai reindirizzato al pannello admin.

**Opzione B — cURL** (vedi anche sezione sotto):

```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin_boss\",\"password\":\"superpassword\",\"ruolo\":\"admin\"}"
```

Poi login:

```bash
curl -X POST http://localhost:8080/login \
  -c admin_cookies.txt \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin_boss\",\"password\":\"superpassword\"}"
```

### Utente standard di esempio (libreria personale)

| Campo    | Valore           |
| -------- | ---------------- |
| Username | `mario_rossi`    |
| Password | `password123`    |
| Ruolo    | `user` (default) |

---

# 🧪 Comandi cURL per il Test (RESTful API & Sessioni)

Utilizza questi comandi dal terminale per verificare il corretto funzionamento del backend e simulare il comportamento di Angular.

> 💡 **Nota Fondamentale sui Cookie di Sessione**
> Poiché il backend protegge le rotte tramite sessioni PHP, nei comandi `curl` vengono utilizzati:
>
> * `-c cookies.txt` → salva il cookie di sessione generato dal server
> * `-b cookies.txt` → reinvia il cookie nelle richieste successive

---

## 1. Flusso di Autenticazione (`AuthController`)

### Registrazione di un Utente Standard (`user`)

```bash
curl -X POST http://localhost:8080/register \
-H "Content-Type: application/json" \
-d "{\"username\":\"mario_rossi\",\"password\":\"password123\",\"ruolo\":\"user\"}"
```

### Registrazione di un Amministratore (`admin`)

```bash
curl -X POST http://localhost:8080/register \
-H "Content-Type: application/json" \
-d "{\"username\":\"admin_boss\",\"password\":\"superpassword\",\"ruolo\":\"admin\"}"
```

### Login Utente

Questo comando crea e popola il file locale `cookies.txt` con il token di sessione.

```bash
curl -X POST http://localhost:8080/login \
-c cookies.txt \
-H "Content-Type: application/json" \
-d "{\"username\":\"mario_rossi\",\"password\":\"password123\"}"
```

### Verifica dello Stato della Sessione

Utilizzato dall'AuthGuard di Angular.

```bash
curl -X GET http://localhost:8080/check-session -b cookies.txt
```

### Logout Utente

```bash
curl -X POST http://localhost:8080/logout -b cookies.txt
```

---

## 2. Gestione dei Libri dell'Utente (`APIController`)

Tutti i comandi di questa sezione richiedono che l'utente sia autenticato. I dati vengono automaticamente associati all'utente presente in sessione.

### Salva un Nuovo Libro

```bash
curl -X POST http://localhost:8080/books \
-b cookies.txt \
-H "Content-Type: application/json" \
-d "{\"titolo\":\"Il Signore degli Anelli\",\"autore\":\"J.R.R. Tolkien\",\"anno\":1954,\"genere\":\"Fantasy\",\"editore\":\"Bompiani\",\"descrizione\":\"L epicita della Terra di Mezzo.\"}"
```

### Elenco dei Libri dell'Utente

```bash
curl -X GET http://localhost:8080/books -b cookies.txt
```

### Filtri Avanzati, Ricerca e Dashboard

```bash
# Filtra per stato di lettura
curl -X GET "http://localhost:8080/books?stato=da_leggere" -b cookies.txt

# Mostra solo i preferiti
curl -X GET "http://localhost:8080/books?preferito=1" -b cookies.txt

# Ricerca per titolo o autore
curl -X GET "http://localhost:8080/books?q=Tolkien" -b cookies.txt

# Statistiche dashboard
curl -X GET http://localhost:8080/stats -b cookies.txt
```

### Dettaglio, Aggiornamento e Rimozione di un Libro

```bash
# Dettaglio libro
curl -X GET http://localhost:8080/books/ID_DEL_LIBRO -b cookies.txt

# Aggiornamento completo
curl -X PUT http://localhost:8080/books/ID_DEL_LIBRO \
-b cookies.txt \
-H "Content-Type: application/json" \
-d "{\"titolo\":\"Il Signore degli Anelli - Nuova Edizione\",\"autore\":\"J.R.R. Tolkien\",\"anno\":1954,\"editore\":\"Bompiani\",\"voto\":5}"

# Aggiornamento stato
curl -X PATCH http://localhost:8080/books/ID_DEL_LIBRO/state \
-b cookies.txt \
-H "Content-Type: application/json" \
-d "{\"stato\":\"in_lettura\"}"

# Preferiti
curl -X PATCH http://localhost:8080/books/ID_DEL_LIBRO/favorite \
-b cookies.txt \
-H "Content-Type: application/json" \
-d "{\"preferito\":true}"

# Eliminazione
curl -X DELETE http://localhost:8080/books/ID_DEL_LIBRO -b cookies.txt
```

### 🛑 Test del Vincolo di Bypass

Tentativo di accesso senza cookie valido:

```bash
curl -X GET http://localhost:8080/books
```

**Risposta attesa:**

```json
{
  "error": "Non autorizzato"
}
```

Codice HTTP: `401 Unauthorized`

---

## 3. Pannello di Amministrazione (`APIController`)

Effettua prima il login come amministratore:

```bash
curl -X POST http://localhost:8080/login \
-c admin_cookies.txt \
-H "Content-Type: application/json" \
-d "{\"username\":\"admin_boss\",\"password\":\"superpassword\"}"
```

### Statistiche Globali Utenti

```bash
curl -X GET http://localhost:8080/admin/stats -b admin_cookies.txt
```

### Elenco Utenti

```bash
curl -X GET http://localhost:8080/admin/users -b admin_cookies.txt
```

### Reset Password Utente

Imposta la password di default a `1234@`.

```bash
curl -X PATCH http://localhost:8080/admin/users/ID_UTENTE/reset-password \
-b admin_cookies.txt
```

### Eliminazione di un Singolo Utente

```bash
curl -X DELETE http://localhost:8080/admin/users/ID_UTENTE \
-b admin_cookies.txt
```

### Eliminazione Massiva di Tutti gli Utenti

```bash
curl -X DELETE http://localhost:8080/admin/users \
-b admin_cookies.txt
```

---

## 📦 Gestione Dipendenze (Composer)

Per installare nuove librerie all'interno del container:

```bash
docker compose exec my_web composer require nome/libreria
```

---

## 🔗 Stringa di Connessione PHP

```php
$client = new MongoDB\Client(
    "mongodb://admin:password123@mongodb:27017"
);
```

---

## 🧹 Pulizia

Per arrestare i container ed eliminare i volumi Docker (cancellando tutti i dati):

```bash
docker compose down -v
```
