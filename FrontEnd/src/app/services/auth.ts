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

  private httpOptions = { withCredentials: true };

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // ==========================================
  //  ROTTE DI AUTENTICAZIONE STANDARD
  // ==========================================

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

  // ==========================================
  //  ROTTE AMMINISTRATORE (Ruolo: admin)
  // ==========================================

  // 5. Recupera le statistiche globali della piattaforma (es. numero utenti totali)
  getAdminStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`, this.httpOptions);
  }

  // 6. Recupera la lista di tutti gli utenti registrati
  listUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`, this.httpOptions);
  }

  // 7. Elimina un utente specifico tramite ID
  deleteUser(idUser: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/users/${idUser}`, this.httpOptions);
  }

  // 8. Cancella TUTTI gli utenti dal database (Usa con cautela!)
  deleteAllUsers(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/users`, this.httpOptions);
  }

  // 9. Resetta la password di un utente specifico a quella di default
  resetPassword(idUser: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/users/${idUser}/reset-password`, {}, this.httpOptions);
  }
}