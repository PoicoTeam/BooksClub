import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    // Rotta iniziale: se l'utente digita solo l'URL, viene rimandato al login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Rotte pubbliche di autenticazione
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
    },

    // Rotta per la dashboard principale (Catalogo Libri)
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    // Rotta per aggiungere un libro
    {
        path: 'add-book',
        loadComponent: () => import('./pages/add-book/add-book').then(m => m.AddBookComponent),
        canActivate: [authGuard] 
    },

    // Rotta jolly: se l'utente scrive un URL inventato, torna al login
    { path: '**', redirectTo: 'login' }
];