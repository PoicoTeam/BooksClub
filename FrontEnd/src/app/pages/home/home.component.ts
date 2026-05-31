import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { OpenLibraryService } from '../../services/open-library.service';
import { OpenLibraryDoc } from '../../models/open-library.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  openLibraryBooks: OpenLibraryDoc[] = [];
  carouselA: OpenLibraryDoc[] = [];
  carouselB: OpenLibraryDoc[] = [];
  openLibraryLoading = false;
  errorMessage = '';

  constructor(
    private readonly openLibraryService: OpenLibraryService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadOpenLibraryBooks();
  }

  loadOpenLibraryBooks(): void {
    this.openLibraryLoading = true;
    console.log('Inizio caricamento libri...');

    this.openLibraryService
      .getFictionBooks()
      .pipe(
        finalize(() => {
          console.log('Finalize: settaggio openLibraryLoading = false');
          this.openLibraryLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (books) => {
          console.log('Libri caricati dal componente:', books, 'Lunghezza:', books.length);
          this.openLibraryBooks = books;
          this.carouselA = books.slice(0, 10);
          this.carouselB = books.slice(10, 20);
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Errore componente:', error);
          this.errorMessage = error?.message || 'Errore durante il caricamento dei libri Open Library.';
          this.cdr.markForCheck();
        }
      });
  }

  openBookDetails(book: OpenLibraryDoc): void {
    if (book.key) {
      const olid = book.key.split('/').pop();
      if (olid) {
        this.router.navigate(['/books/open-library', olid]);
      }
    }
  }
}
