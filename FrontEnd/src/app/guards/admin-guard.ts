import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { map, of, catchError } from 'rxjs';

/*
  ADMIN GUARD (adminGuard)
  Consente l'accesso a /admin solo se la sessione ha ruolo === 'admin'.
  Gli utenti normali vengono rimandati alla dashboard.
*/
export const adminGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  // se l'utente è già in memoria (dopo login) evita una chiamata HTTP extra
  if (authService.currentUserValue?.ruolo === 'admin') {
    return true;
  }

  return authService.checkSession().pipe(
    map((res) => {
      if (res.logged && res.ruolo === 'admin') {
        return true;
      }
      router.navigate(['/dashboard']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
