import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { map, tap } from 'rxjs';

export const authGuard = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Controlliamo la sessione dal server
  return authService.checkSession().pipe(
    map(res => !!res.logged), // Trasforma la risposta in true/false
    tap(isLogged => {
      if (!isLogged) {
        // Se non è loggato, rimandiamo al login
        router.navigate(['/login']);
      }
    })
  );
};