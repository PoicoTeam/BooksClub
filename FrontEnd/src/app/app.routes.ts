import { Routes } from '@angular/router';

import { HomeCatalogComponent } from './pages/home-catalog/home-catalog.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeCatalogComponent,
  },
  {
    path: 'libro/:id',
    component: BookDetailsComponent,
  },
  {
    path: 'carrello',
    component: CartComponent,
  },
];

