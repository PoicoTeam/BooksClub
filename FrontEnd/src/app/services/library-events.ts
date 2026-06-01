import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Notifica i componenti che il catalogo o le statistiche vanno ricaricati */
@Injectable({ providedIn: 'root' })
export class LibraryEvents {
  private readonly catalogChangedSubject = new Subject<void>();
  readonly catalogChanged$ = this.catalogChangedSubject.asObservable();

  notifyCatalogChanged(): void {
    this.catalogChangedSubject.next();
  }
}
