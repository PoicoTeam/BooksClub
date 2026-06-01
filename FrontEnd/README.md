# BooksClub — Frontend (Angular)

Interfaccia SPA per la **libreria personale** BooksClub: catalogo libri per utente, autenticazione a sessione PHP e pannello amministratore.

## Stack

| Tecnologia | Uso |
|------------|-----|
| Angular 21 | Standalone components, lazy routes |
| TypeScript | Modelli `Book`, `BookStats`, `User`, risposte API |
| Tailwind CSS | UI responsive, tema chiaro/scuro |
| RxJS | HTTP, eventi catalogo, notifiche toast |

## Funzionalità

### Autenticazione
- Registrazione (solo ruolo `user`)
- Login / logout con cookie di sessione (`withCredentials`)
- `authGuard` e `adminGuard` sulle rotte protette

### Libreria personale
- Dashboard con statistiche (`GET /stats`)
- Ricerca per titolo/autore e filtri (stato lettura, preferiti)
- **Paginazione lato client** (12 libri per pagina; il backend restituisce l’elenco completo)
- Dettaglio libro: stato, preferiti, modifica, eliminazione
- Aggiunta e modifica libro con validazione URL copertina (opzionale, `http`/`https`)
- Placeholder copertina se URL assente o immagine non caricabile

### Amministrazione
- Pannello `/admin` (solo ruolo `admin`)
- Gestione utenti tramite servizio dedicato `Admin` (nessuna duplicazione in `Auth`)

### UX
- **Navbar** e **footer** condivisi (`AppLayout` / `AuthLayout`)
- **Animazioni** leggere: transizione tra pagine, card libreria a scaglioni, menu mobile
- Rispetto di `prefers-reduced-motion` per l’accessibilità
- **Toast** globali (`Notification` + `app-toast-container`) al posto di `alert()`
- Messaggi errore derivati dalle risposte API (`getApiErrorMessage`)
- **Refresh automatico** di libri e statistiche dopo CRUD (`LibraryEvents`)

## Avvio in sviluppo

### Prerequisiti
- Node.js 18+
- Backend PHP attivo (es. Docker sulla porta `8080`)

### Installazione

```bash
cd FrontEnd
npm install
```

### Server di sviluppo

```bash
npm start
```

L’app è su [http://localhost:4200](http://localhost:4200).

Le richieste verso `/api/*` sono inoltrate al backend tramite `proxy.conf.json` (target `http://localhost:8080`, rewrite senza prefisso `/api`).

## Struttura principale

```text
src/app/
├── components/
│   ├── navbar/              # Navigazione app / auth
│   ├── footer/              # Piè di pagina
│   └── toast-container/     # Notifiche UI
├── layouts/
│   ├── app-layout/          # Shell area autenticata
│   └── auth-layout/         # Shell login/registrazione
├── guards/
│   ├── auth-guard.ts
│   └── admin-guard.ts
├── interceptors/
│   └── auth.interceptor.ts  # withCredentials su tutte le richieste
├── models/
│   ├── auth.model.ts
│   ├── book.model.ts
│   └── user.model.ts
├── pages/                   # Login, register, dashboard, libri, admin
├── services/
│   ├── auth.ts              # Solo autenticazione
│   ├── admin.ts             # Solo API admin
│   ├── book.ts
│   ├── library-events.ts    # Evento refresh catalogo
│   ├── notification.ts
│   └── theme.ts
└── utils/
    ├── api-error.ts
    ├── book-cover.ts
    └── validators.ts
```

## Script utili

| Comando | Descrizione |
|---------|-------------|
| `npm start` | `ng serve` con proxy API |
| `npm run build` | Build produzione in `dist/FrontEnd` |
| `npm test` | Test unitari (Vitest) |

## Integrazione backend

- Base URL relativa: `/api`
- Sessione: cookie PHP (`PHPSESSID`) inviato automaticamente
- Non committare la cartella `.angular/` (cache di build): è in `.gitignore`

Per CORS e sessioni, il backend deve consentire l’origine `http://localhost:4200` e le credenziali. Vedi la documentazione nella cartella `BackEnd/`.

## Note

- La paginazione è **solo frontend**: quando il catalogo cresce molto, in futuro si potrà aggiungere `limit`/`offset` sul backend senza cambiare il flusso utente.
- Gli account admin non si creano dalla registrazione pubblica; vanno provisionati nel database.
