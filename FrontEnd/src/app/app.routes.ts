import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { InfoLibroComponent } from './components/info-libro/info-libro.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'books/open-library/:olid', component: InfoLibroComponent },
  { path: '**', component: NotFoundComponent }
];
