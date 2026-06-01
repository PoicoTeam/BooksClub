import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

/*
  CONFIGURAZIONE GLOBALE DELL'APPLICAZIONE (appConfig)
  Registra router, HttpClient con interceptor per le sessioni PHP e Zone.js.
*/
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // withCredentials su ogni richiesta HTTP verso /api (cookie PHPSESSID)
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
