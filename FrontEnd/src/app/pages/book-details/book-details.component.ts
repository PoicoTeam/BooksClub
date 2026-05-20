import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BOOKS, type Book, type BookCategory } from '../../data/books';
import { CartService } from '../../services/cart.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cart = inject(CartService);

  readonly book = computed<Book | null>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return null;
    return BOOKS.find((b) => b.id === id) ?? null;
  });

  readonly qty = signal(1);

  add() {
    const b = this.book();
    if (!b) return;
    this.cart.addToCart(b, this.qty());
  }
}

