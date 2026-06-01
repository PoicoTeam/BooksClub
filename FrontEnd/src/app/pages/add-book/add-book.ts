import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Book } from '../../services/book';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-book.html'
})
export class AddBookComponent {
  private fb = inject(FormBuilder);
  private bookService = inject(Book);
  private router = inject(Router);

  // Inizializzazione del form inclusa la proprietà per la copertina
  bookForm: FormGroup = this.fb.group({
    titolo: ['', Validators.required],
    autore: ['', Validators.required],
    anno: [null],
    editore: [''],
    isbn: [''],
    descrizione: [''],
    genere: [''],
    voto: [null, [Validators.min(1), Validators.max(5)]],
    copertina: [''] // <-- Nuovo controllo reattivo associato all'input HTML
  });

  saveBook() {
    if (this.bookForm.valid) {
      // Estraiamo i dati dal form
      const bookData = this.bookForm.value;

      // Trasformiamo esplicitamente in numeri interi i valori se presenti
      if (bookData.anno) bookData.anno = parseInt(bookData.anno, 10);
      if (bookData.voto) bookData.voto = parseInt(bookData.voto, 10);

      // Invio dell'oggetto aggiornato al servizio che comunica con l'API PHP
      this.bookService.addBook(bookData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error("Errore durante il salvataggio del libro:", err);
        }
      });
    }
  }
}