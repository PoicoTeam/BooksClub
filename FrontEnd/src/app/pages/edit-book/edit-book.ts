import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Book } from '../../services/book';
import { BookPayload } from '../../models/book.model';
import { Notification } from '../../services/notification';
import { LibraryEvents } from '../../services/library-events';
import { getApiErrorMessage } from '../../utils/api-error';
import { optionalUrlValidator } from '../../utils/validators';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-book.html',
  styleUrl: './edit-book.css',
})
export class EditBookComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(Book);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notification = inject(Notification);
  private libraryEvents = inject(LibraryEvents);

  bookForm!: FormGroup;
  bookId = '';
  loading = true;
  saving = false;

  ngOnInit() {
    this.bookForm = this.fb.group({
      titolo: ['', Validators.required],
      autore: ['', Validators.required],
      anno: [null],
      genere: [''],
      editore: [''],
      isbn: [''],
      voto: [null, [Validators.min(1), Validators.max(5)]],
      copertina: ['', optionalUrlValidator()],
      descrizione: [''],
    });

    const id = this.route.snapshot.paramMap.get('idBook');
    if (!id) {
      this.notification.error('ID del libro non valido.');
      this.loading = false;
      return;
    }
    this.bookId = id;
    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.bookForm.patchValue({
          titolo: data.titolo,
          autore: data.autore,
          anno: data.anno,
          genere: data.genere ?? '',
          editore: data.editore ?? '',
          isbn: data.isbn ?? '',
          voto: data.voto,
          copertina: data.copertina ?? '',
          descrizione: data.descrizione ?? '',
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notification.error(getApiErrorMessage(err, 'Impossibile caricare il libro.'));
      },
    });
  }

  saveChanges() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      if (this.bookForm.get('copertina')?.hasError('invalidUrl')) {
        this.notification.warning('URL copertina non valido.');
      }
      return;
    }

    const raw = this.bookForm.value;
    const payload: BookPayload = {
      titolo: raw.titolo,
      autore: raw.autore,
      anno: raw.anno ? Number(raw.anno) : null,
      editore: raw.editore ?? '',
      isbn: raw.isbn ?? '',
      descrizione: raw.descrizione ?? '',
      genere: raw.genere ?? '',
      voto: raw.voto ? Number(raw.voto) : null,
      copertina: raw.copertina?.trim() || '',
    };

    this.saving = true;
    this.bookService.updateBook(this.bookId, payload).subscribe({
      next: () => {
        this.libraryEvents.notifyCatalogChanged();
        this.notification.success('Libro aggiornato.');
        this.router.navigate(['/book-details', this.bookId]);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(getApiErrorMessage(err, 'Errore durante il salvataggio.'));
      },
    });
  }
}
