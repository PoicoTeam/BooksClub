import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Book as BookModel,
  BookMutationResponse,
  BookPayload,
  BookStats,
} from '../models/book.model';

export interface BookListFilters {
  stato?: string;
  preferito?: boolean;
  q?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Book {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  private httpOptions = { withCredentials: true };

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

  getBookById(idBook: string): Observable<BookModel> {
    return this.http.get<BookModel>(`${this.apiUrl}/books/${idBook}`, this.httpOptions);
  }

  getStats(): Observable<BookStats> {
    return this.http.get<BookStats>(`${this.apiUrl}/stats`, this.httpOptions);
  }

  addBook(book: BookPayload): Observable<BookMutationResponse> {
    return this.http.post<BookMutationResponse>(`${this.apiUrl}/books`, book, this.httpOptions);
  }

  updateBook(idBook: string, book: BookPayload): Observable<BookMutationResponse> {
    return this.http.put<BookMutationResponse>(
      `${this.apiUrl}/books/${idBook}`,
      book,
      this.httpOptions
    );
  }

  updateBookState(idBook: string, stato: string): Observable<BookMutationResponse> {
    return this.http.patch<BookMutationResponse>(
      `${this.apiUrl}/books/${idBook}/state`,
      { stato },
      this.httpOptions
    );
  }

  toggleFavorite(idBook: string, preferito: boolean): Observable<BookMutationResponse> {
    return this.http.patch<BookMutationResponse>(
      `${this.apiUrl}/books/${idBook}/favorite`,
      { preferito },
      this.httpOptions
    );
  }

  deleteBook(idBook: string): Observable<BookMutationResponse> {
    return this.http.delete<BookMutationResponse>(
      `${this.apiUrl}/books/${idBook}`,
      this.httpOptions
    );
  }
}
