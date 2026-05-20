import { Injectable, computed, signal } from '@angular/core';

import type { Book } from '../data/books';

export interface CartItem {
  book: Book;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = computed(() => this._items());

  readonly itemCount = computed(() =>
    this._items().reduce((acc, it) => acc + it.quantity, 0)
  );

  readonly total = computed(() =>
    this._items().reduce((acc, it) => acc + it.book.price * it.quantity, 0)
  );

  addToCart(book: Book, quantity = 1) {
    const qty = Math.max(1, Math.floor(quantity));
    const items = this._items();
    const idx = items.findIndex((x) => x.book.id === book.id);

    if (idx >= 0) {
      const next = [...items];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
      this._items.set(next);
      return;
    }

    this._items.set([...items, { book, quantity: qty }]);
  }

  remove(bookId: string) {
    this._items.set(this._items().filter((x) => x.book.id !== bookId));
  }

  setQuantity(bookId: string, quantity: number) {
    const q = Math.floor(quantity);
    if (q <= 0) {
      this.remove(bookId);
      return;
    }

    this._items.set(
      this._items().map((x) =>
        x.book.id === bookId ? { ...x, quantity: q } : x
      )
    );
  }

  clear() {
    this._items.set([]);
  }
}

