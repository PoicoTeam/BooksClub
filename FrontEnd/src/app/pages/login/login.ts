import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Auth } from '../../services/auth';
import { Notification } from '../../services/notification';
import { getApiErrorMessage } from '../../utils/api-error';

/*
  PAGINA LOGIN (LoginComponent)
  Form di accesso: invia credenziali a POST /login e reindirizza
  alla dashboard (user) o al pannello admin in base al ruolo in sessione.
*/
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private notification = inject(Notification);

  loginForm: FormGroup;
  errorMessage = '';

  

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Inserisci username e password.';
      return;
    }

    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.notification.success('Accesso effettuato.');
          // admin seed → /admin, utente normale → /dashboard
          const target = response.ruolo === 'admin' ? '/admin' : '/dashboard';
          this.router.navigate([target]);
        } else {
          this.errorMessage = response.message || 'Credenziali non valide.';
        }
      },
      error: (err) => {
        this.errorMessage = getApiErrorMessage(err, 'Username o password non corretti.');
      },
    });
  }

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
}
