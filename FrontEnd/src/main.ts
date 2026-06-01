/*
  ENTRYPOINT ANGULAR (main.ts)
  Avvia l'applicazione BooksClub collegando il componente root e la configurazione globale.
*/

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
