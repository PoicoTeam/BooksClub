import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent {
  book?: Book;
  loading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'ID del libro non valido.';
      this.loading = false;
      return;
    }

    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.book = books.find((item) => item._id === id);
        if (!this.book) {
          this.errorMessage = 'Libro non trovato.';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error?.message || 'Errore durante il caricamento del libro.';
        this.loading = false;
      }
    });
  }

  deleteBook(): void {
    if (!this.book?._id) {
      return;
    }

    this.bookService.deleteBook(this.book._id).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => (this.errorMessage = error?.message || 'Errore durante l\'eliminazione del libro.')
    });
  }

  toggleFavorite(): void {
    if (!this.book?._id) {
      return;
    }

    this.bookService.updateFavorite(this.book._id, !this.book.preferito).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => (this.errorMessage = error?.message || 'Errore durante l\'aggiornamento del preferito.')
    });
  }

  changeState(stato: string): void {
    if (!this.book?._id) {
      return;
    }

    this.bookService.updateState(this.book._id, stato).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => (this.errorMessage = error?.message || 'Errore durante l\'aggiornamento dello stato.')
    });
  }
}
