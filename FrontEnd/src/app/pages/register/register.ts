import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { NgIf, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, AsyncPipe],
  templateUrl: './register.html'
})

export class RegisterComponent { 
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isDark$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.isDark$ = this.themeService.isDark$;
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      ruolo: ['user']
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Per favore, compila tutti i campi correttamente.';
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.successMessage = 'Registrazione completata! Reindirizzamento...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Errore durante la registrazione.';
      }
    });

  }
}