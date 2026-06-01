import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminStats {
  numero_utenti_registrati: number;
}

export interface AdminUser {
  id: string;
  username: string;
}

/*
  SERVIZIO PANNELLO ADMIN (Admin)
  Rotte riservate al ruolo admin su APIController (gestione utenti piattaforma).
  Separato da Auth: qui non ci sono login/register.
*/
@Injectable({ providedIn: 'root' })
export class Admin {
  private http = inject(HttpClient);
  private url = '/api';
  private httpOptions = { withCredentials: true };

  // GET /admin/stats
  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.url}/admin/stats`, this.httpOptions);
  }

  // GET /admin/users — solo utenti con ruolo user
  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.url}/admin/users`, this.httpOptions);
  }

  // DELETE /admin/users/{id}
  deleteUser(id: string): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(
      `${this.url}/admin/users/${id}`,
      this.httpOptions
    );
  }

  // PATCH /admin/users/{id}/reset-password — password default 1234@ lato backend
  resetPassword(id: string): Observable<{ status: string; message: string }> {
    return this.http.patch<{ status: string; message: string }>(
      `${this.url}/admin/users/${id}/reset-password`,
      {},
      this.httpOptions
    );
  }
}
