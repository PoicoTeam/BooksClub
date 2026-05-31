import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { OpenLibraryDoc, OpenLibrarySearchResult } from '../models/open-library.model';

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryService {
  private readonly baseUrl = 'https://openlibrary.org';

  constructor(private readonly http: HttpClient) {}

  getFictionBooks(): Observable<OpenLibraryDoc[]> {
    const params = { q: 'fiction', limit: '20' };
    return this.http.get<OpenLibrarySearchResult>(`${this.baseUrl}/search.json`, { params }).pipe(
      map((response) => {
        console.log('Risposta Open Library:', response);
        return response.docs || [];
      }),
      catchError((error) => {
        console.error('Errore caricamento Open Library', error);
        return throwError(() => new Error('Impossibile caricare i libri da Open Library.'));
      })
    );
  }

  getBookDetails(olid: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/books/${olid}.json`).pipe(
      catchError((error) => {
        console.error('Errore caricamento dettagli libro', error);
        return throwError(() => new Error('Impossibile caricare i dettagli del libro.'));
      })
    );
  }

  searchBooks(query: string): Observable<OpenLibraryDoc[]> {
    const params = { q: query, limit: '20' };
    return this.http.get<OpenLibrarySearchResult>(`${this.baseUrl}/search.json`, { params }).pipe(
      map((response) => response.docs || []),
      catchError((error) => {
        console.error('Errore caricamento Open Library', error);
        return throwError(() => new Error('Impossibile caricare i libri da Open Library.'));
      })
    );
  }
}
