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

  bookForm: FormGroup = this.fb.group({
    titolo: ['', Validators.required],
    autore: ['', Validators.required]
  });

  saveBook() {
    if (this.bookForm.valid) {
      this.bookService.addBook(this.bookForm.value).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}