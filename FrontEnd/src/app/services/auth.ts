import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import {
  AuthSuccessResponse,
  LoginPayload,
  RegisterPayload,
  SessionResponse,
} from '../models/auth.model';

/*
  SERVIZIO DI AUTENTICAZIONE (Auth)
  Comunica con AuthController PHP: register, login, logout, check-session.
  Mantiene in memoria l'utente corrente per navbar e guard (ruolo user | admin).
*/
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  // stato reattivo dell'utente loggato (null se non autenticato)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // fondamentale per inviare il cookie di sessione PHP al backend
  private httpOptions = { withCredentials: true };

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // POST /register — solo utenti standard (l'admin è creato dal seed backend)
  register(userData: RegisterPayload): Observable<AuthSuccessResponse> {
    return this.http.post<AuthSuccessResponse>(
      `${this.apiUrl}/register`,
      { username: userData.username, password: userData.password },
      this.httpOptions
    );
  }

  // POST /login — aggiorna currentUser se la risposta è success
  login(credentials: LoginPayload): Observable<AuthSuccessResponse> {
    return this.http
      .post<AuthSuccessResponse>(`${this.apiUrl}/login`, credentials, this.httpOptions)
      .pipe(
        tap((res) => {
          if (res.status === 'success' && res.username && res.ruolo) {
            this.currentUserSubject.next({ username: res.username, ruolo: res.ruolo });
          }
        })
      );
  }

  /*
   GET /check-session
   Usato dagli authGuard prima di aprire le pagine protette.
  */
  checkSession(): Observable<SessionResponse> {
    return this.http.get<SessionResponse>(`${this.apiUrl}/check-session`, this.httpOptions).pipe(
      tap({
        next: (res) => {
          if (res.logged && res.username && res.ruolo) {
            this.currentUserSubject.next({ username: res.username, ruolo: res.ruolo });
          } else {
            this.currentUserSubject.next(null);
          }
        },
        error: () => this.currentUserSubject.next(null),
      })
    );
  }

  // POST /logout — svuota lo stato locale dell'utente
  logout(): Observable<AuthSuccessResponse> {
    return this.http.post<AuthSuccessResponse>(`${this.apiUrl}/logout`, {}, this.httpOptions).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }
}
