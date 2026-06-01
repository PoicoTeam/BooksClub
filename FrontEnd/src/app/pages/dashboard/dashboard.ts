import { Component, inject, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme';
import { Book } from '../../services/book'; 
import { Auth } from '../../services/auth';
import { BookDetailsComponent } from '../book-details/book-details';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit { 
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private bookService = inject(Book); 
  private authService = inject(Auth);

  isDark$ = this.themeService.isDark$;
  books: any[] = [];

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data || [];
      },
      error: (err) => {
        console.error("Errore nel caricamento dei libri:", err);
      }
    });
  }

  getStars(voto: number): string {
    const roundedVoto = Math.round(voto);
    const filledStars = '⭐'.repeat(Math.max(0, Math.min(5, roundedVoto)));
    const emptyStars = '☆'.repeat(Math.max(0, Math.min(5, 5 - roundedVoto)));
    return filledStars + emptyStars;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('user_session');
        this.router.navigate(['/login']);
      }
    });
  }
}