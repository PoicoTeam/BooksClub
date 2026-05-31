import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/list`).pipe(
      catchError((error) => {
        console.error('Errore caricamento lista libri', error);
        return throwError(() => new Error('Impossibile caricare la lista dei libri.'));
      })
    );
  }

  addBook(book: { titolo: string; autore: string; anno?: number }): Observable<void> {
    const body = new URLSearchParams();
    body.set('titolo', book.titolo);
    body.set('autore', book.autore);
    if (book.anno !== undefined && book.anno !== null) {
      body.set('anno', String(book.anno));
    }

    return this.http
      .post(`${this.baseUrl}/add`, body.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        responseType: 'text',
        observe: 'response'
      })
      .pipe(
        map(() => undefined),
        catchError((error) => {
          console.error('Errore durante l\'aggiunta del libro', error);
          return throwError(() => new Error('Impossibile aggiungere il libro.'));
        })
      );
  }

  deleteBook(id: string): Observable<void> {
    return this.http
      .post(`${this.baseUrl}/books/${id}/cancel`, '', {
        responseType: 'text',
        observe: 'response'
      })
      .pipe(
        map(() => undefined),
        catchError((error) => {
          console.error('Errore durante l\'eliminazione del libro', error);
          return throwError(() => new Error('Impossibile eliminare il libro.'));
        })
      );
  }

  updateState(id: string, stato: string): Observable<void> {
    const body = new URLSearchParams();
    body.set('stato', stato);

    return this.http
      .post(`${this.baseUrl}/books/${id}/state`, body.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        responseType: 'text',
        observe: 'response'
      })
      .pipe(
        map(() => undefined),
        catchError((error) => {
          console.error('Errore durante l\'aggiornamento dello stato', error);
          return throwError(() => new Error('Impossibile aggiornare lo stato del libro.'));
        })
      );
  }

  updateFavorite(id: string, preferito: boolean): Observable<void> {
    const body = new URLSearchParams();
    body.set('preferito', preferito ? '1' : '0');

    return this.http
      .post(`${this.baseUrl}/books/${id}/favorite`, body.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        responseType: 'text',
        observe: 'response'
      })
      .pipe(
        map(() => undefined),
        catchError((error) => {
          console.error('Errore durante l\'aggiornamento del preferito', error);
          return throwError(() => new Error('Impossibile aggiornare il preferito del libro.'));
        })
      );
  }
}
