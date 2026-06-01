import { Component, inject, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme';
import { Book } from '../../services/book'; 
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit { 
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private bookService = inject(Book); 
  private authService = inject(Auth);

  isDark$ = this.themeService.isDark$;
  books: any[] = []; // contenitore dei libri

  ngOnInit() {
    this.loadBooks(); // Carica i libri appena il componente è pronto
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data; // Popola l'array con i dati del database
      },
      error: (err) => {
        console.error("Errore nel caricamento dei libri:", err);
      }
    });
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
      // Se il server fallisce, forziamo comunque il logout locale
      localStorage.removeItem('user_session');
      this.router.navigate(['/login']);
    }
  });
}
}