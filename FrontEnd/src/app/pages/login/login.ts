import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, AsyncPipe], 
  templateUrl: './login.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';
  isDark$ = this.themeService.isDark$;

  constructor() {
    // Configurazione form di login
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Inserisci username e password.';
      return;
    }

    this.errorMessage = '';

    // Invio dati al backend PHP (POST /login)
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          // Login riuscito! Il cookie di sessione è salvato, andiamo alla dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Se per caso risponde 200 ma con uno stato di fallimento custom
          this.errorMessage = response.message || 'Credenziali non valide.';
        }
      },
      error: (err) => {
        // Intercetta l'errore (es. 401 Unauthorized o 500) proveniente da PHP
        this.errorMessage = err.error?.error || 'Username o password non corretti.';
      }
    });
  }
}