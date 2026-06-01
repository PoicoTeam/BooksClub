import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);


  private apiUrl = '/api'; 

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Opzioni HTTP obbligatorie per far funzionare le $_SESSION di PHP con Angular
  private httpOptions = { withCredentials: true };

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // 1. Registrazione (POST /register)
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, this.httpOptions);
  }

  // 2. Login (POST /login)
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, this.httpOptions).pipe(
      tap(res => {
        if (res.status === 'success') {
          this.currentUserSubject.next({ username: res.username, ruolo: res.ruolo });
        }
      })
    );
  }

  // 3. Controllo Sessione automatico (GET /check-session)
  checkSession(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check-session`, this.httpOptions).pipe(
      tap({
        next: (res) => {
          if (res.logged) {
            this.currentUserSubject.next({ username: res.username, ruolo: res.ruolo });
          }
        },
        error: () => this.currentUserSubject.next(null)
      })
    );
  }

  // 4. Logout (POST /logout)
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, this.httpOptions).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }
}