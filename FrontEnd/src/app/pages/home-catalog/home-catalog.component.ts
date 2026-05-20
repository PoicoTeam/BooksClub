import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BOOKS, type Book, type BookCategory } from '../../data/books';
import { CartService } from '../../services/cart.service';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, BookCardComponent],

  templateUrl: './home-catalog.component.html',
  styleUrl: './home-catalog.component.css',
})
export class HomeCatalogComponent {
  private readonly cart = inject(CartService);

  readonly books = BOOKS;

  readonly categories = computed(() => {
    const cats = Array.from(new Set(this.books.map((b) => b.category)));
    return cats.sort((a, b) => a.localeCompare(b));
  });

  readonly query = signal('');
  readonly selectedCategory = signal<BookCategory | 'Tutte'>('Tutte');

  readonly setQuery = (v: string) => this.query.set(v);
  readonly setCategory = (v: BookCategory | 'Tutte') => this.selectedCategory.set(v);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.selectedCategory();


    return this.books.filter((b) => {
      const matchesQ =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      const matchesCat = cat === 'Tutte' ? true : b.category === cat;
      return matchesQ && matchesCat;
    });
  });

  addQuick(book: Book) {
    this.cart.addToCart(book, 1);
  }
}

