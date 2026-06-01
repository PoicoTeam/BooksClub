# 📚 BooksClub - Frontend

Questo è il modulo frontend dell'applicazione **BooksClub**, sviluppato con **Angular**. L'applicazione permette la gestione di un catalogo personale di libri, con autenticazione utente e supporto per il tema Dark/Light.

## 🚀 Tecnologie Utilizzate

- Angular 17+ (Standalone Components)
- Tailwind CSS (per lo styling)
- RxJS (per la gestione dei flussi di dati asincroni)
- TypeScript

## 🛠️ Funzionalità

### 🔐 Autenticazione
- Login
- Registrazione
- Protezione delle rotte tramite `AuthGuard`

### 📚 Dashboard
- Visualizzazione dinamica dei libri caricati dal database

### ✏️ CRUD
- Possibilità di aggiungere nuovi libri al proprio catalogo

### 🎨 Temi
- Supporto nativo per modalità **Dark** e **Light**

### 🛡️ Sicurezza
- Gestione delle sessioni tramite `withCredentials` verso il backend PHP

## ⚙️ Configurazione e Avvio

### Prerequisiti

- Node.js (v18+)
- Angular CLI

```bash
npm install -g @angular/cli
```

### Installazione

1. Entra nella cartella del frontend:

```bash
cd FrontEnd
```

2. Installa le dipendenze:

```bash
npm install
```

### Sviluppo

Per avviare il server di sviluppo locale:

```bash
ng serve
```

L'applicazione sarà accessibile all'indirizzo:

```text
http://localhost:4200
```

## 📁 Struttura del Progetto

```text
src/
└── app/
    ├── pages/      # Componenti delle pagine (Dashboard, Login, AddBook, ecc.)
    ├── services/   # Servizi di comunicazione con il backend e ThemeService
    └── guards/     # Logiche di protezione delle rotte (auth.guard.ts)
```

### Directory principali

- `src/app/pages/`  
  Contiene i componenti delle pagine dell'applicazione (Dashboard, Login, AddBook, ecc.).

- `src/app/services/`  
  Contiene i servizi per la comunicazione con il backend (`AuthService`, `BookService`) e il `ThemeService`.

- `src/app/guards/`  
  Contiene le logiche di protezione delle rotte (`auth.guard.ts`).

## 🔗 Integrazione Backend

Il frontend comunica con il backend PHP tramite chiamate HTTP.

Assicurati che il backend sia attivo e configurato correttamente per gestire le intestazioni CORS:

```http
Access-Control-Allow-Origin: http://localhost:4200
```

Inoltre, per la gestione delle sessioni tramite cookie, il backend deve supportare le richieste con credenziali (`withCredentials`).