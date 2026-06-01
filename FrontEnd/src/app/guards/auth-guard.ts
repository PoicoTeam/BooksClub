import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { map, of, catchError } from 'rxjs';

export const authGuard = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Controlliamo la sessione dal server
  return authService.checkSession().pipe(
    map(res => {
      if (res.logged) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};