import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent {
  titolo = '';
  autore = '';
  anno = '';
  errorMessage = '';

  @Output() addBook = new EventEmitter<{ titolo: string; autore: string; anno?: number }>();

  submit(): void {
    this.errorMessage = '';

    if (!this.titolo.trim() || !this.autore.trim()) {
      this.errorMessage = 'Titolo e autore sono obbligatori.';
      return;
    }

    this.addBook.emit({
      titolo: this.titolo.trim(),
      autore: this.autore.trim(),
      anno: this.anno ? Number(this.anno) : undefined
    });

    this.titolo = '';
    this.autore = '';
    this.anno = '';
  }
}
