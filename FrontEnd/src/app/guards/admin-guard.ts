import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { map, of, catchError } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

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
