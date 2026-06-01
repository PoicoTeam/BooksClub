import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Notification } from '../../services/notification';
import { getApiErrorMessage } from '../../utils/api-error';
import { NgIf } from '@angular/common';

/*
  PAGINA REGISTRAZIONE (RegisterComponent)
  Crea un nuovo account utente standard (ruolo user) tramite POST /register.
  L'account admin è solo quello creato dal seed backend (vedi README).
*/
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './register.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private notification: Notification
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Per favore, compila tutti i campi correttamente.';
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';

    const { username, password } = this.registerForm.value;
    this.authService.register({ username, password }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.successMessage = 'Registrazione completata! Reindirizzamento...';
          this.notification.success('Account creato con successo.');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      },
      error: (err) => {
        this.errorMessage = getApiErrorMessage(err, 'Errore durante la registrazione.');
      },
    });
  }
}
