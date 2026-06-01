import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Book {
  private http = inject(HttpClient);
  private apiUrl = '/api'; 

  // Opzioni necessarie per condividere i cookie di sessione PHP
  private httpOptions = { withCredentials: true };

  // 1. Recupera la lista di tutti i libri dell'utente
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/books`, this.httpOptions);
  }

  // 2. Recupera il dettaglio di un singolo libro tramite ID
  getBookById(idBook: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/books/${idBook}`, this.httpOptions);
  }

  // 3. Recupera le statistiche dei libri dell'utente loggato
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`, this.httpOptions);
  }

  // 4. Aggiunge un nuovo libro
  addBook(book: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/books`, book, this.httpOptions);
  }

  // 5. Modifica completa di un libro esistente
  updateBook(idBook: string, book: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/books/${idBook}`, book, this.httpOptions);
  }

  // 6. Cambia lo stato di un libro (es. da leggere, in lettura, letto)
  updateBookState(idBook: string, state: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/books/${idBook}/state`, { state }, this.httpOptions);
  }

  // 7. Aggiunge o rimuove un libro dai preferiti (Toggle)
  toggleFavorite(idBook: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/books/${idBook}/favorite`, {}, this.httpOptions);
  }

  // 8. Elimina un libro
  deleteBook(idBook: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/books/${idBook}`, this.httpOptions);
  }
}