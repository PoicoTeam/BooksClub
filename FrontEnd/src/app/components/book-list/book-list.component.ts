import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  @Input() books: Book[] = [];
  @Output() deleteBook = new EventEmitter<string>();
  @Output() stateChange = new EventEmitter<{ id: string; stato: string }>();
  @Output() favoriteToggle = new EventEmitter<{ id: string; preferito: boolean }>();

  onDelete(id?: string): void {
    if (id) {
      this.deleteBook.emit(id);
    }
  }

  onStateChange(book: Book, event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (book._id && target.value) {
      this.stateChange.emit({ id: book._id, stato: target.value });
    }
  }

  onToggleFavorite(book: Book): void {
    if (book._id) {
      this.favoriteToggle.emit({ id: book._id, preferito: !book.preferito });
    }
  }
}
