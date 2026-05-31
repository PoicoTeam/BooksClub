import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { OpenLibraryService } from '../../services/open-library.service';

@Component({
  selector: 'app-info-libro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-libro.component.html',
  styleUrls: ['./info-libro.component.css']
})
export class InfoLibroComponent implements OnInit {
  bookDetails: any = null;
  loading = false;
  errorMessage = '';
  olid = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly openLibraryService: OpenLibraryService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.olid = this.route.snapshot.paramMap.get('olid') || '';
    if (this.olid) {
      this.loadBookDetails();
    } else {
      this.errorMessage = 'ID del libro non valido.';
    }
  }

  loadBookDetails(): void {
    this.loading = true;
    console.log('Caricamento dettagli libro con olid:', this.olid);

    this.openLibraryService
      .getBookDetails(this.olid)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (details) => {
          console.log('Dettagli libro caricati:', details);
          this.bookDetails = details;
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Errore caricamento dettagli:', error);
          this.errorMessage = error?.message || 'Errore durante il caricamento dei dettagli.';
          this.cdr.markForCheck();
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
