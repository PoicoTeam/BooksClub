# 📚 BooksClub - Full-Stack Application

BooksClub è un'applicazione web full-stack progettata per la gestione di cataloghi librari personali. Il sistema consente agli utenti di creare, modificare, consultare ed eliminare libri attraverso un'interfaccia moderna sviluppata con Angular e un backend RESTful realizzato con PHP, Slim Framework e MongoDB.

L'applicazione è stata sviluppata seguendo una chiara separazione tra frontend e backend, adottando un'architettura modulare che facilita manutenzione, scalabilità ed evoluzione futura del progetto.

---

# ✨ Caratteristiche Principali

* 🔐 Sistema di autenticazione completo (Registrazione, Login e Logout)
* 👥 Gestione ruoli Utente e Amministratore
* 📚 Gestione catalogo libri tramite operazioni CRUD complete
* 🌙 Supporto ai temi Dark e Light
* 🔒 Gestione sicura delle sessioni tramite PHP Session
* 🌐 API RESTful sviluppate con Slim Framework
* 🗄️ Persistenza dati tramite MongoDB
* 🐳 Ambiente di sviluppo containerizzato tramite Docker
* 🎯 Architettura Full-Stack moderna basata su Angular e PHP

---

# 🏗️ Architettura del Sistema

Il progetto è composto da tre componenti principali:

| Componente | Tecnologia           | Funzione                      |
| ---------- | -------------------- | ----------------------------- |
| Frontend   | Angular + TypeScript | Interfaccia utente SPA        |
| Backend    | PHP + Slim Framework | API REST e logica applicativa |
| Database   | MongoDB              | Archiviazione dei dati        |

La comunicazione tra frontend e backend avviene tramite richieste HTTP verso API RESTful dedicate.

---

# 📁 Struttura del Progetto

```plaintext
/
├── FrontEnd/         # Applicazione Angular
├── BackEnd/          # API PHP e logica applicativa
├── docker-compose.yml
└── README.md
```

Ogni modulo possiede una documentazione dedicata:

* `FrontEnd/README.md`
* `BackEnd/README.md`

---

# 👤 Sistema di Autenticazione

BooksClub implementa un sistema di autenticazione basato su sessioni PHP.

Le funzionalità disponibili includono:

* Registrazione nuovi utenti
* Login autenticato
* Logout sicuro
* Gestione della sessione tramite cookie PHPSESSID
* Protezione delle rotte riservate
* Controllo degli accessi basato sui ruoli

## Ruoli Disponibili

### Utente

Può:

* Accedere al proprio catalogo
* Visualizzare i libri disponibili
* Aggiungere nuovi libri
* Modificare i libri esistenti
* Eliminare libri dal catalogo

### Amministratore

Dispone di privilegi estesi rispetto all'utente standard e può accedere alle funzionalità amministrative previste dal sistema.

---

# 📚 Gestione Catalogo Libri

Il cuore dell'applicazione è il sistema di gestione della libreria personale.

Ogni utente può effettuare operazioni CRUD complete:

### Creazione

Inserimento di nuovi libri nel catalogo.

### Lettura

Visualizzazione dinamica dei libri salvati nel database.

### Modifica

Aggiornamento delle informazioni associate ai libri esistenti.

### Eliminazione

Rimozione dei libri dal catalogo.

Tutte le operazioni vengono sincronizzate con MongoDB tramite API REST.

---

# 🎨 Personalizzazione dell'Interfaccia

L'applicazione integra un sistema di gestione dei temi che permette di alternare:

* Modalità Light
* Modalità Dark

Il cambio tema viene applicato dinamicamente per migliorare l'esperienza utente.

---

# 🔒 Sicurezza

Sono state adottate diverse misure per garantire la sicurezza dell'applicazione:

* Sessioni gestite lato server
* Cookie di autenticazione
* Middleware di protezione delle rotte
* Controllo degli accessi basato sui ruoli
* Configurazione CORS dedicata
* Separazione tra frontend e backend

---

# 🐳 Ambiente Docker

L'applicazione è progettata per essere eseguita tramite Docker.

L'utilizzo dei container permette di:

* Standardizzare l'ambiente di sviluppo
* Ridurre problemi di configurazione
* Facilitare il deployment
* Isolare frontend, backend e database

---

# 🚀 Avvio del Progetto

## Prerequisiti

Prima di iniziare assicurarsi di avere installato:

* Docker
* Docker Compose

---

## Clonazione Repository

```bash
git clone <repository-url>
cd BooksClub
```

---

## Avvio dei Container

Dalla cartella principale del progetto:

```bash
docker compose up --build
```

oppure:

```bash
docker-compose up --build
```

Una volta completata l'inizializzazione:

| Servizio         | Indirizzo                       |
| ---------------- | ------------------------------- |
| Frontend Angular | http://localhost:4200           |
| Backend PHP      | Configurato tramite Docker      |
| MongoDB          | Database locale containerizzato |

---

# 🗄️ Database

BooksClub utilizza MongoDB come sistema di persistenza dati.

Il database viene eseguito localmente all'interno dell'ambiente Docker e memorizza:

* Utenti
* Sessioni
* Cataloghi librari
* Informazioni dei libri

La connessione viene gestita centralmente tramite Dependency Injection nel backend.

---

# ⚙️ Stack Tecnologico

## Frontend

* Angular
* TypeScript
* RxJS
* Tailwind CSS

## Backend

* PHP
* Slim Framework
* PHP-DI
* Composer

## Database

* MongoDB

## DevOps

* Docker
* Docker Compose

---

# ⚠️ Limitazioni Attuali

La versione corrente del progetto non include ancora:

* Ricerca avanzata dei libri
* Filtri per categoria o autore
* Ordinamento personalizzato
* Test automatici
* Documentazione API tramite Swagger/OpenAPI

Queste funzionalità potranno essere implementate nelle future versioni del progetto.

---

# 🚀 Evoluzioni Future

Possibili miglioramenti previsti:

* Ricerca full-text
* Filtri dinamici
* Ordinamento avanzato
* Upload immagini di copertina
* Dashboard statistiche
* Sistema recensioni e valutazioni
* Notifiche e promemoria di lettura
* API documentate con Swagger
* Suite di test automatizzati

---

# 📄 Licenza

Questo progetto è stato sviluppato a scopo didattico e formativo per approfondire lo sviluppo di applicazioni full-stack moderne utilizzando Angular, PHP e MongoDB.

---

## 👨‍💻 Autore

BooksClub rappresenta un progetto completo di gestione libraria che integra frontend moderno, backend RESTful e database NoSQL in un'unica soluzione scalabile e facilmente estendibile.
