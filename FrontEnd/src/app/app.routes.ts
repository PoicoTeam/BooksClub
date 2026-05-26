import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { ListaBook } from './pages/lista-book/lista-book';

export const routes: Routes = [
    {path: '', component: HomePage},
    {path:'libri', component: ListaBook},
    {path:'**', redirectTo:''}
];
