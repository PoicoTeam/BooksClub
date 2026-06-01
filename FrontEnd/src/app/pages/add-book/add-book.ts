import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Book } from '../../services/book';
import { Notification } from '../../services/notification';
import { LibraryEvents } from '../../services/library-events';
import { BookPayload } from '../../models/book.model';
import { getApiErrorMessage } from '../../utils/api-error';
import { optionalUrlValidator } from '../../utils/validators';

/*
  PAGINA AGGIUNGI LIBRO (AddBookComponent)
  Form reattivo per POST /books: titolo, autore, metadati, stato lettura e URL copertina.
*/
@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './add-book.html',
})
export class AddBookComponent {
  private fb = inject(FormBuilder);
  private bookService = inject(Book);
  private router = inject(Router);
  private notification = inject(Notification);
  private libraryEvents = inject(LibraryEvents);

  saving = false;

  // definizione campi allineati al documento MongoDB lato backend
  bookForm: FormGroup = this.fb.group({
    titolo: ['', Validators.required],
    autore: ['', Validators.required],
    anno: [null],
    editore: [''],
    isbn: [''],
    descrizione: [''],
    genere: [''],
    voto: [null, [Validators.min(1), Validators.max(5)]],
    copertina: ['', optionalUrlValidator()],
    stato: ['da_leggere'],
  });

  saveBook() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      if (this.bookForm.get('copertina')?.hasError('invalidUrl')) {
        this.notification.warning('Inserisci un URL copertina valido (http o https) oppure lascia vuoto.');
      }
      return;
    }

    const raw = this.bookForm.value;
    const bookData: BookPayload = {
      titolo: raw.titolo,
      autore: raw.autore,
      anno: raw.anno ? parseInt(raw.anno, 10) : null,
      editore: raw.editore || '',
      isbn: raw.isbn || '',
      descrizione: raw.descrizione || '',
      genere: raw.genere || '',
      voto: raw.voto ? parseInt(raw.voto, 10) : null,
      copertina: raw.copertina?.trim() || '',
      stato: raw.stato,
    };

    this.saving = true;
    this.bookService.addBook(bookData).subscribe({
      next: () => {
        this.libraryEvents.notifyCatalogChanged();
        this.notification.success('Libro aggiunto alla tua libreria.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(
          getApiErrorMessage(err, 'Errore durante il salvataggio del libro.')
        );
      },
    });
  }
}
