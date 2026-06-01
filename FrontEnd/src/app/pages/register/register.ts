import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Notification } from '../../services/notification';
import { getApiErrorMessage } from '../../utils/api-error';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './register.html'
})

export class RegisterComponent { 
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private notification: Notification
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      ruolo: ['user' as const],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Per favore, compila tutti i campi correttamente.';
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';

    const { username, password, ruolo } = this.registerForm.value;
    this.authService.register({ username, password, ruolo }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          const ruoloLabel = ruolo === 'admin' ? 'amministratore' : 'utente';
          this.successMessage = `Registrazione come ${ruoloLabel} completata! Reindirizzamento...`;
          this.notification.success(`Account ${ruoloLabel} creato.`);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      },
      error: (err) => {
        this.errorMessage = getApiErrorMessage(err, 'Errore durante la registrazione.');
      },
    });

  }
}