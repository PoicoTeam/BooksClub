import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Book } from '../../services/book';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-details.html'
})
export class BookDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(Book);
  private themeService = inject(ThemeService);

  isDark$ = this.themeService.isDark$;
  bookData: any = null;
  loading: boolean = true;
  errorMessage: string = '';

  ngOnInit() {
    // Recupera l'ID del libro passato tramite la rotta dinamica
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
        console.error("Errore nel recupero dei dettagli del libro:", err);
        this.errorMessage = 'Impossibile trovare il libro richiesto o non sei autorizzato.';
        this.loading = false;
      }
    });
  }

  // Generatore di stelle per la valutazione
  getStars(voto: number): string {
    const roundedVoto = Math.round(voto);
    const filledStars = '⭐'.repeat(Math.max(0, Math.min(5, roundedVoto)));
    const emptyStars = '☆'.repeat(Math.max(0, Math.min(5, 5 - roundedVoto)));
    return filledStars + emptyStars;
  }

  // Helper per formattare i badge degli stati di lettura di MongoDB
  formatStato(stato: string): string {
    const stati: { [key: string]: string } = {
      'da_leggere': '📚 Da Leggere',
      'in_lettura': '📖 In Lettura',
      'letto': '✅ Letto'
    };
    return stati[stato] || stato;
  }
}