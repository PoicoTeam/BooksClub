# BooksClub - PHP & MongoDB Docker Suite

Questo progetto configura un ambiente di sviluppo completo per un'applicazione PHP 8.3 che comunica con un database NoSQL MongoDB, il tutto orchestrato con Docker.

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

1. **PHP 8.3 (Apache)**: Esposto sulla porta `8080`. Include il driver nativo `mongodb` e `Composer`.
2. **MongoDB 7.0**: Il database principale, esposto sulla porta `27017`.
3. **Mongo Express**: Interfaccia grafica di gestione DB, raggiungibile su `http://localhost:8081`.

---

## ⚙️ Requisiti

- Docker installato sul PC.
- Docker Compose attivo.

---

## 🏁 Istruzioni per l'uso

### 1. Clonazione e Setup
Assicurati che lo script di entrypoint abbia i permessi di esecuzione e il formato corretto (LF):
```bash
chmod +x build/entrypoint-php.sh
```

### 2. Avvio dell'ambiente
Dalla root del progetto, lancia il comando:
```bash
docker compose up -d --build
```

### 3. Accesso ai servizi
- **Applicazione PHP**: [http://localhost:8080](http://localhost:8080)
- **Pannello MongoDB**: [http://localhost:8081](http://localhost:8081)
  - *Login Browser*: `admin` / `pass`
  - *Credenziali DB*: `admin` / `password123`

---

## 🧪 Comandi CURL per il Test

Usa questi comandi dal terminale per verificare il corretto funzionamento del backend senza usare il frontend.

### 1. Gestione Libri

Mostra l'elenco completo di tutti i libri memorizzati nel database:
```bash
curl http://localhost:8080/list
```

Salva un nuovo libro nella tua libreria personale:
```bash
curl -X POST http://localhost:8080/add \
     -d "titolo=Il Signore degli Anelli" \
     -d "autore=J.R.R. Tolkien" \
     -d "anno=1954"
```

Elimina in modo permanente un libro specifico (Sostituisci `ID_DEL_LIBRO` con l'ID reale restituito dalla chiamata `/list`):
```bash
curl -X POST http://localhost:8080/books/ID_DEL_LIBRO/cancel
```

### 2. Stati e Preferiti

Cambia lo stato di lettura di un libro (es: impostalo su `letto` o `da_leggere`):
```bash
curl -X POST http://localhost:8080/books/ID_DEL_LIBRO/state \
     -d "stato=letto"
```

Aggiungi o rimuovi un libro dai tuoi preferiti (Invia `1` per attivarlo, `0` per disattivarlo):
```bash
curl -X POST http://localhost:8080/books/ID_DEL_LIBRO/favorite \
     -d "preferito=1"
```

---

## 📦 Gestione Dipendenze (Composer)

Per installare nuove librerie (come il driver MongoDB per PHP), esegui:
```bash
docker compose exec my_web composer require mongodb/mongodb
```

---

## 🔗 Stringa di Connessione PHP

Per collegare la tua application al database, usa questa stringa:
```php
\$client = new MongoDB\Client("mongodb://admin:password123@mongodb:27017");
```

---

## 🧹 Pulizia
Per fermare i servizi e rimuovere i volumi (cancellando i dati del DB):
```bash
docker compose down -v
```
