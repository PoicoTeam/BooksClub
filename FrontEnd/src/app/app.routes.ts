import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

/*
  DEFINIZIONE DELLE ROTTE (routes)
  Due layout principali: AuthLayout (login/register) e AppLayout (area autenticata).
  Le pagine sono caricate in lazy loading per ridurre il bundle iniziale.
*/
export const routes: Routes = [
  // rotta iniziale: reindirizza al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // --- ROTTE PUBBLICHE (autenticazione) ---
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then((m) => m.RegisterComponent),
      },
    ],
  },

  // --- ROTTE PROTETTE (libreria personale + admin) ---
  {
    path: '',
    loadComponent: () =>
      import('./layouts/app-layout/app-layout').then((m) => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'add-book',
        loadComponent: () => import('./pages/add-book/add-book').then((m) => m.AddBookComponent),
      },
      {
        path: 'book-details/:idBook',
        loadComponent: () =>
          import('./pages/book-details/book-details').then((m) => m.BookDetailsComponent),
      },
      {
        path: 'edit-book/:idBook',
        loadComponent: () => import('./pages/edit-book/edit-book').then((m) => m.EditBookComponent),
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin-panel/admin-panel').then((m) => m.AdminPanel),
        canActivate: [adminGuard],
      },
    ],
  },

  // rotta jolly: URL non validi tornano al login
  { path: '**', redirectTo: 'login' },
];
