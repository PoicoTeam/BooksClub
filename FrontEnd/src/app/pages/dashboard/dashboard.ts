import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from '../../services/book';
import { Auth } from '../../services/auth';
import { Notification } from '../../services/notification';
import { LibraryEvents } from '../../services/library-events';
import { Book as BookModel, BookStats } from '../../models/book.model';
import { User } from '../../models/user.model';
import { getApiErrorMessage } from '../../utils/api-error';
import { markCoverFailed, shouldShowCover } from '../../utils/book-cover';

// numero di card libri per pagina (paginazione lato client)
export const DASHBOARD_PAGE_SIZE = 12;

/*
  PAGINA DASHBOARD (DashboardComponent)
  Libreria personale: statistiche, ricerca, filtri, griglia libri e paginazione.
  Si aggiorna quando LibraryEvents segnala un CRUD sui libri.
*/
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private bookService = inject(Book);
  private authService = inject(Auth);
  private notification = inject(Notification);
  private libraryEvents = inject(LibraryEvents);
  private subscriptions = new Subscription();

  readonly pageSize = DASHBOARD_PAGE_SIZE;
  readonly shouldShowCover = shouldShowCover;
  readonly markCoverFailed = markCoverFailed;

  allBooks: BookModel[] = [];
  stats: BookStats | null = null;
  searchQuery = '';
  statoFilter = '';
  showFavoritesOnly = false;
  username = '';
  currentPage = 1;
  loadingBooks = false;

  ngOnInit() {
    // recupera username per il messaggio di benvenuto
    const user = this.authService.currentUserValue;
    if (user) {
      this.applyUser(user);
    } else {
      this.subscriptions.add(
        this.authService.checkSession().subscribe({
          next: (res) => {
            if (res.logged && res.username && res.ruolo) {
              this.applyUser({ username: res.username, ruolo: res.ruolo });
            }
          },
        })
      );
    }

    // ascolta modifiche al catalogo (add/edit/delete da altre pagine)
    this.subscriptions.add(
      this.libraryEvents.catalogChanged$.subscribe(() => this.refreshCatalog())
    );

    this.refreshCatalog();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get statCards(): { label: string; value: number }[] {
    if (!this.stats) {
      return [];
    }
    return [
      { label: 'Totali', value: this.stats.totale_libri },
      { label: 'Da leggere', value: this.stats.da_leggere },
      { label: 'In lettura', value: this.stats.in_lettura },
      { label: 'Letti', value: this.stats.letti },
      { label: 'Preferiti', value: this.stats.preferiti },
    ];
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.allBooks.length / this.pageSize));
  }

  get paginatedBooks(): BookModel[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allBooks.slice(start, start + this.pageSize);
  }

  get paginationLabel(): string {
    if (this.allBooks.length === 0) {
      return 'Nessun libro';
    }
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.allBooks.length);
    return `${start}–${end} di ${this.allBooks.length}`;
  }

  cardDelay(index: number): string {
    return `${Math.min(index, 10) * 55}ms`;
  }

  private applyUser(user: User) {
    this.username = user.username;
  }

  refreshCatalog() {
    this.loadStats();
    this.loadBooks();
  }

  loadStats() {
    this.bookService.getStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) =>
        this.notification.error(
          getApiErrorMessage(err, 'Impossibile caricare le statistiche.')
        ),
    });
  }

  loadBooks() {
    this.loadingBooks = true;
    this.bookService
      .getBooks({
        q: this.searchQuery,
        stato: this.statoFilter || undefined,
        preferito: this.showFavoritesOnly ? true : undefined,
      })
      .subscribe({
        next: (data) => {
          this.allBooks = data || [];
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
          this.loadingBooks = false;
        },
        error: (err) => {
          this.loadingBooks = false;
          this.notification.error(
            getApiErrorMessage(err, 'Errore nel caricamento dei libri.')
          );
        },
      });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadBooks();
  }

  setStatoFilter(stato: string) {
    this.statoFilter = this.statoFilter === stato ? '' : stato;
    this.currentPage = 1;
    this.loadBooks();
  }

  toggleFavoritesFilter() {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.currentPage = 1;
    this.loadBooks();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getStars(voto: number): string {
    const roundedVoto = Math.round(voto);
    const filledStars = '⭐'.repeat(Math.max(0, Math.min(5, roundedVoto)));
    const emptyStars = '☆'.repeat(Math.max(0, Math.min(5, 5 - roundedVoto)));
    return filledStars + emptyStars;
  }

  formatStato(stato: string): string {
    const stati: Record<string, string> = {
      da_leggere: 'Da leggere',
      in_lettura: 'In lettura',
      letto: 'Letto',
    };
    return stati[stato] || stato;
  }
}
