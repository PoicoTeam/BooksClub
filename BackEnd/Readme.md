# BooksClub - PHP & MongoDB Docker Suite

Questo progetto configura un ambiente di sviluppo completo per un'applicazione PHP 8.3 che comunica con un database NoSQL MongoDB, il tutto orchestrato con Docker.

---

## 🚀 Struttura del Progetto

```text
.
├── build/
│   ├── Dockerfile.php         # Configurazione immagine PHP + Driver Mongo
│   └── entrypoint-php.sh      # Script di avvio (composer install + Apache)
├── php/                       # Cartella sorgente della tua App (index.php, ecc.)
├── docker-compose.yml         # Orchestrazione dei servizi
└── README.md
```

---

## 🛠️ Servizi Inclusi

### PHP 8.3 (Apache)
- Esposto sulla porta **8080**
- Include il driver nativo **MongoDB**
- Include **Composer**

### MongoDB 7.0
- Database principale
- Esposto sulla porta **27017**

### Mongo Express
- Interfaccia grafica di gestione del database
- Disponibile su: <http://localhost:8081>

---

## ⚙️ Requisiti

- Docker installato sul PC
- Docker Compose attivo

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

| Servizio | URL |
|-----------|------|
| Applicazione PHP | http://localhost:8080 |
| Pannello MongoDB | http://localhost:8081 |

#### Credenziali

**Mongo Express**

```text
Username: admin
Password: pass
```

**MongoDB**

```text
Username: admin
Password: password123
```

---

# 🧪 Comandi CURL per il Test (RESTful API)

Utilizza questi comandi dal terminale per verificare il corretto funzionamento del backend senza usare il frontend.

> 💡 **Nota per Windows (CMD)**  
> Se esegui i comandi con JSON nel body (`-d`), usa le barre rovesciate per proteggere le virgolette (`\"titolo\"`).

---

## 1. Gestione Core dei Libri

### Mostra l'elenco completo di tutti i libri
*(ordinati A-Z per titolo)*

```bash
curl http://localhost:8080/books
```

### Salva un nuovo libro nella libreria

Ritorna l'ID generato da MongoDB.

```bash
curl -X POST http://localhost:8080/books \
-H "Content-Type: application/json" \
-d "{\"titolo\":\"Il Signore degli Anelli\",\"autore\":\"J.R.R. Tolkien\",\"anno\":1954,\"genere\":\"Fantasy\",\"editore\":\"Bompiani\",\"descrizione\":\"L epicita della Terra di Mezzo.\"}"
```

### Mostra i dettagli di un singolo libro

Sostituisci `ID_DEL_LIBRO` con l'ID reale restituito in fase di salvataggio.

```bash
curl http://localhost:8080/books/ID_DEL_LIBRO
```

### Modifica un libro esistente

Aggiornamento completo della scheda.

```bash
curl -X PUT http://localhost:8080/books/ID_DEL_LIBRO \
-H "Content-Type: application/json" \
-d "{\"titolo\":\"Il Signore degli Anelli - Nuova Edizione\",\"autore\":\"J.R.R. Tolkien\",\"anno\":1954,\"editore\":\"Bompiani\",\"voto\":5}"
```

### Elimina un libro

```bash
curl -X DELETE http://localhost:8080/books/ID_DEL_LIBRO
```

---

## 2. Ricerca, Filtri Avanzati e Dashboard

### Filtra per stato di lettura

Valori disponibili:

- `da_leggere`
- `in_lettura`
- `letto`

```bash
curl http://localhost:8080/books?stato=da_leggere
```

### Mostra solo i preferiti

```bash
curl http://localhost:8080/books?preferito=1
```

### Ricerca globale testuale

Cerca nel titolo o nell'autore (case insensitive).

```bash
curl http://localhost:8080/books?q=Tolkien
```

### Visualizza le statistiche generali

Utile per i contatori della dashboard.

```bash
curl http://localhost:8080/stats
```

---

## 3. Stati e Preferiti (Aggiornamenti Parziali)

### Cambia lo stato di lettura

```bash
curl -X PATCH http://localhost:8080/books/ID_DEL_LIBRO/state \
-H "Content-Type: application/json" \
-d "{\"stato\":\"in_lettura\"}"
```

### Aggiungi/Rimuovi dai preferiti

Imposta:

- `true` → aggiunge ai preferiti
- `false` → rimuove dai preferiti

```bash
curl -X PATCH http://localhost:8080/books/ID_DEL_LIBRO/favorite \
-H "Content-Type: application/json" \
-d "{\"preferito\":true}"
```

---

## 📦 Gestione Dipendenze (Composer)

Per installare nuove librerie (ad esempio il driver MongoDB per PHP):

```bash
docker compose exec my_web composer require mongodb/mongodb
```

---

## 🔗 Stringa di Connessione PHP

Per collegare l'applicazione al database MongoDB:

```php
$client = new MongoDB\Client(
    "mongodb://admin:password123@mongodb:27017"
);
```

---

## 🧹 Pulizia

Per fermare i servizi e rimuovere anche i volumi Docker (eliminando tutti i dati del database):

```bash
docker compose down -v
```