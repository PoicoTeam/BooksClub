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

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private httpOptions = { withCredentials: true };

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(userData: RegisterPayload): Observable<AuthSuccessResponse> {
    return this.http.post<AuthSuccessResponse>(
      `${this.apiUrl}/register`,
      {
        ...userData,
        ruolo: userData.ruolo ?? 'user',
      },
      this.httpOptions
    );
  }

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

  logout(): Observable<AuthSuccessResponse> {
    return this.http.post<AuthSuccessResponse>(`${this.apiUrl}/logout`, {}, this.httpOptions).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }
}
