import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { map, of, catchError } from 'rxjs';

/*
  AUTH GUARD (authGuard)
  Protegge le rotte dell'area autenticata (dashboard, libri, ecc.).
  Chiama GET /check-session: se non loggato reindirizza a /login.
*/
export const authGuard = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.checkSession().pipe(
    map((res) => {
      if (res.logged) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
