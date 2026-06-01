import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Book } from '../../services/book';
import { ThemeService } from '../../services/theme';
import { Notification } from '../../services/notification';
import { LibraryEvents } from '../../services/library-events';
import { Book as BookModel, BookStato } from '../../models/book.model';
import { getApiErrorMessage } from '../../utils/api-error';
import { markCoverFailed, shouldShowCover } from '../../utils/book-cover';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-details.html',
})
export class BookDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(Book);
  private themeService = inject(ThemeService);
  private notification = inject(Notification);
  private libraryEvents = inject(LibraryEvents);

  readonly shouldShowCover = shouldShowCover;
  readonly markCoverFailed = markCoverFailed;

  isDark$ = this.themeService.isDark$;
  bookData: BookModel | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit() {
    const idBook = this.route.snapshot.paramMap.get('idBook');

    if (idBook) {
      this.loadBookDetails(idBook);
    } else {
      this.errorMessage = 'ID del libro non valido.';
      this.loading = false;
    }
  }

  loadBookDetails(id: string) {
    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.bookData = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = getApiErrorMessage(
          err,
          'Impossibile trovare il libro richiesto o non sei autorizzato.'
        );
        this.loading = false;
      },
    });
  }

  getStars(voto: number): string {
    const roundedVoto = Math.round(voto);
    const filledStars = '⭐'.repeat(Math.max(0, Math.min(5, roundedVoto)));
    const emptyStars = '☆'.repeat(Math.max(0, Math.min(5, 5 - roundedVoto)));
    return filledStars + emptyStars;
  }

  formatStato(stato: string | undefined): string {
    if (!stato) {
      return '📚 Da Leggere';
    }
    const stati: Record<string, string> = {
      da_leggere: '📚 Da Leggere',
      in_lettura: '📖 In Lettura',
      letto: '✅ Letto',
    };
    return stati[stato] || stato;
  }

  changeStato(stato: BookStato) {
    if (!this.bookData?._id) {
      return;
    }
    this.bookService.updateBookState(this.bookData._id, stato).subscribe({
      next: () => {
        this.bookData!.stato = stato;
        this.libraryEvents.notifyCatalogChanged();
        this.notification.success('Stato di lettura aggiornato.');
      },
      error: (err) =>
        this.notification.error(
          getApiErrorMessage(err, 'Errore durante l\'aggiornamento dello stato.')
        ),
    });
  }

  togglePreferito() {
    if (!this.bookData?._id) {
      return;
    }
    const next = !this.bookData.preferito;
    this.bookService.toggleFavorite(this.bookData._id, next).subscribe({
      next: () => {
        this.bookData!.preferito = next;
        this.libraryEvents.notifyCatalogChanged();
        this.notification.success(
          next ? 'Aggiunto ai preferiti.' : 'Rimosso dai preferiti.'
        );
      },
      error: (err) =>
        this.notification.error(
          getApiErrorMessage(err, 'Errore durante l\'aggiornamento dei preferiti.')
        ),
    });
  }

  deleteBook() {
    if (!this.bookData?._id) {
      return;
    }
    if (confirm('Sei sicuro di voler eliminare questo libro definitivamente?')) {
      this.bookService.deleteBook(this.bookData._id).subscribe({
        next: () => {
          this.libraryEvents.notifyCatalogChanged();
          this.notification.success('Libro eliminato.');
          this.router.navigate(['/dashboard']);
        },
        error: (err) =>
          this.notification.error(getApiErrorMessage(err, 'Errore durante l\'eliminazione.')),
      });
    }
  }
}
