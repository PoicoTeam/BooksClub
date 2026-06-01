import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Book as BookModel,
  BookMutationResponse,
  BookPayload,
  BookStats,
} from '../models/book.model';

// parametri opzionali per GET /books (filtri lato server)
export interface BookListFilters {
  stato?: string;
  preferito?: boolean;
  q?: string;
}

/*
  SERVIZIO LIBRI (Book)
  Wrapper HTTP per le rotte APIController: CRUD libri, statistiche, stato e preferiti.
  Ogni utente vede solo i propri libri grazie alla sessione PHP.
*/
@Injectable({
  providedIn: 'root',
})
export class Book {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  private httpOptions = { withCredentials: true };

  // GET /books — elenco con filtri opzionali (stato, preferito, ricerca q)
  getBooks(filters?: BookListFilters): Observable<BookModel[]> {
    let params = new HttpParams();
    if (filters?.stato) {
      params = params.set('stato', filters.stato);
    }
    if (filters?.preferito !== undefined) {
      params = params.set('preferito', filters.preferito ? '1' : '0');
    }
    if (filters?.q?.trim()) {
      params = params.set('q', filters.q.trim());
    }
    return this.http.get<BookModel[]>(`${this.apiUrl}/books`, {
      ...this.httpOptions,
      params,
    });
  }

  // GET /books/{idBook}
  getBookById(idBook: string): Observable<BookModel> {
    return this.http.get<BookModel>(`${this.apiUrl}/books/${idBook}`, this.httpOptions);
  }

  // GET /stats — contatori per la dashboard (totali, letti, preferiti, ecc.)
  getStats(): Observable<BookStats> {
    return this.http.get<BookStats>(`${this.apiUrl}/stats`, this.httpOptions);
  }

  // POST /books
  addBook(book: BookPayload): Observable<BookMutationResponse> {
    return this.http.post<BookMutationResponse>(`${this.apiUrl}/books`, book, this.httpOptions);
  }

  // PUT /books/{idBook}
  updateBook(idBook: string, book: BookPayload): Observable<BookMutationResponse> {
    return this.http.put<BookMutationResponse>(
      `${this.apiUrl}/books/${idBook}`,
      book,
      this.httpOptions
    );
  }

  // PATCH /books/{idBook}/state — body: { stato }
  updateBookState(idBook: string, stato: string): Observable<BookMutationResponse> {
    return this.http.patch<BookMutationResponse>(
      `${this.apiUrl}/books/${idBook}/state`,
      { stato },
      this.httpOptions
    );
  }

  // PATCH /books/{idBook}/favorite — body: { preferito }
  toggleFavorite(idBook: string, preferito: boolean): Observable<BookMutationResponse> {
    return this.http.patch<BookMutationResponse>(
      `${this.apiUrl}/books/${idBook}/favorite`,
      { preferito },
      this.httpOptions
    );
  }

  // DELETE /books/{idBook}
  deleteBook(idBook: string): Observable<BookMutationResponse> {
    return this.http.delete<BookMutationResponse>(
      `${this.apiUrl}/books/${idBook}`,
      this.httpOptions
    );
  }
}
