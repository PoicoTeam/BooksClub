# BooksClub — Libreria personale (Full-Stack)

BooksClub è un’applicazione web per gestire una **libreria personale di libri**: ogni utente ha il proprio catalogo (titolo, autore, stato di lettura, preferiti, copertina, recensione). Il frontend Angular comunica con un backend REST in PHP (Slim + MongoDB) tramite sessioni PHP sicure.

---

## Caratteristiche

| Area | Dettaglio |
|------|-----------|
| Autenticazione | Registrazione, login, logout, `check-session` |
| Ruoli | `user` (libreria privata), `admin` (gestione utenti) |
| Libri | CRUD, filtri, ricerca, statistiche personali |
| UI | Tema chiaro/scuro, toast, paginazione catalogo |
| DevOps | Docker Compose per backend e database |

---

## Architettura

```text
┌─────────────────┐     HTTP + cookie      ┌──────────────────┐
│  FrontEnd       │ ─────────────────────► │  BackEnd (PHP)   │
│  Angular :4200  │      /api → proxy      │  Slim :8080      │
└─────────────────┘                        └────────┬─────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │  MongoDB         │
                                           └──────────────────┘
```

| Modulo | Percorso | Documentazione |
|--------|----------|----------------|
| Frontend | `FrontEnd/` | [FrontEnd/README.md](FrontEnd/README.md) |
| Backend | `BackEnd/` | [BackEnd/README.md](BackEnd/README.md) |

---

## Avvio rapido

### Prerequisiti
- Docker e Docker Compose
- Node.js 18+ (solo per sviluppo frontend locale)

### 1. Backend e database

Dalla root del progetto:

```bash
docker compose up --build
```

(Configurazione in `BackEnd/docker-compose.yaml`.)

### 2. Frontend

```bash
cd FrontEnd
npm install
npm start
```

| Servizio | URL |
|----------|-----|
| Angular (dev) | http://localhost:4200 |
| API PHP (via proxy Angular) | http://localhost:4200/api → backend |

---

## Flusso utente tipico

1. **Registrazione** → account `user` (libreria personale) oppure `admin` solo per test
2. **Login** → dashboard (user) o pannello admin (`/admin`)
3. **Aggiungi libro** → compilazione form (URL copertina opzionale ma validato)
4. **Dettaglio** → cambio stato, preferiti, modifica o elimina
5. **Admin** → gestione utenti su `/admin` (richiede ruolo `admin`)

Dopo ogni operazione sul catalogo, la dashboard aggiorna automaticamente libri e contatori.

### Account admin di test (nessun seed automatico)

Il backend **non** inserisce un amministratore al primo avvio: va creato con `POST /register` e `"ruolo":"admin"`.

| Modalità | Dove | Credenziali suggerite |
| -------- | ---- | ----------------------- |
| UI Angular | http://localhost:4200/register → «Amministratore — solo per test» | A scelta (es. sotto) |
| API / cURL | Vedi [BackEnd/Readme.md](BackEnd/Readme.md) | `admin_boss` / `superpassword` |

Esempio rapido dopo `docker compose up`:

```text
Username: admin_boss
Password: superpassword
Ruolo:    admin
```

Documentazione completa (curl, MongoDB, pannello admin): **[BackEnd/Readme.md](BackEnd/Readme.md)**.

---

## Stack tecnologico

**Frontend:** Angular 21, TypeScript, Tailwind CSS, RxJS  

**Backend:** PHP, Slim Framework, MongoDB  

**Tooling:** Docker, npm, Angular CLI  

---

## Repository e file da non versionare

Il `.gitignore` alla root esclude, tra l’altro:

- `FrontEnd/node_modules/`, `FrontEnd/.angular/`, `FrontEnd/dist/`
- `BackEnd/php/vendor/`

Se in passato sono stati committati file sotto `.angular/cache`, rimuovili dal tracking con:

```bash
git rm -r --cached FrontEnd/.angular
```

---

## Sicurezza (panoramica)

- Sessioni lato server (`$_SESSION`, cookie `PHPSESSID`)
- Ogni utente vede solo i propri libri (`utente_id` sul backend)
- Rotte admin protette da ruolo
- Registrazione `admin` esposta nel frontend **solo per test**; in produzione va rimossa o bloccata lato API

---

## Stato attuale vs. evoluzioni

**Già presente nel frontend**

- Ricerca e filtri sul catalogo
- Statistiche dashboard
- Toast e gestione errori API
- Paginazione client-side del catalogo
- Validazione URL copertina e placeholder immagine

**Possibili estensioni future**

- Paginazione server-side (`limit` / `offset` su `GET /books`)
- Upload file copertina (oggi solo URL)
- Test e2e e documentazione OpenAPI
- Ordinamento personalizzato (titolo, data, voto)

---

## Licenza

Progetto didattico — vedi file [LICENSE](LICENSE).
