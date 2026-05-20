import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Book } from '../../data/books';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css',
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;

  private readonly cart = inject(CartService);

  readonly canBuy = computed(() => this.book.price > 0);

  add() {
    this.cart.addToCart(this.book, 1);
  }
}


