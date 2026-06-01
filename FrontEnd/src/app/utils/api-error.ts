import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorBody } from '../models/auth.model';

/*
  HELPER ERRORI API (getApiErrorMessage)
  Estrae un messaggio leggibile dalle risposte di errore del backend PHP
  per mostrarlo nei toast invece di alert generici.
*/
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    const body = err.error as ApiErrorBody | string | null;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object') {
      return body.error || body.message || fallback;
    }
    if (err.status === 0) {
      return 'Impossibile contattare il server. Verifica che il backend sia avviato.';
    }
    if (err.status === 401) {
      return 'Sessione scaduta o non autorizzato.';
    }
    if (err.status === 403) {
      return 'Operazione non consentita.';
    }
    if (err.status === 404) {
      return 'Risorsa non trovata.';
    }
  }
  return fallback;
}
