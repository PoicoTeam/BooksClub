import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Book {
  private http = inject(HttpClient);
  private apiUrl = '/api'; 

  // Recupera la lista dei libri
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-books`, { withCredentials: true });
  }

  // Aggiunge un libro (se necessario)
  addBook(book: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-book`, book, { withCredentials: true });
  }
}