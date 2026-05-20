import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';


import { RouterLink } from '@angular/router';

import { CartService } from '../../services/cart.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  readonly cart = inject(CartService);

  readonly items = computed(() => this.cart.items());
  readonly total = computed(() => this.cart.total());

  inc(id: string) {
    const it = this.cart.items().find((x) => x.book.id === id);
    if (!it) return;
    this.cart.setQuantity(id, it.quantity + 1);
  }

  dec(id: string) {
    const it = this.cart.items().find((x) => x.book.id === id);
    if (!it) return;
    this.cart.setQuantity(id, it.quantity - 1);
  }

  remove(id: string) {
    this.cart.remove(id);
  }

  clear() {
    this.cart.clear();
  }

  checkout() {
    // finto checkout
    alert(`Checkout simulato! Totale: € ${this.total().toFixed(2)}`);
    this.cart.clear();
  }
}

