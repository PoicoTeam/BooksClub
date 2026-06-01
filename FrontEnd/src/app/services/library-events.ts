import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/*
  EVENTI CATALOGO (LibraryEvents)
  Segnala alla dashboard che libri o statistiche vanno ricaricati dopo un CRUD
  (aggiunta, modifica, eliminazione, preferiti, stato lettura).
*/
@Injectable({ providedIn: 'root' })
export class LibraryEvents {
  private readonly catalogChangedSubject = new Subject<void>();
  readonly catalogChanged$ = this.catalogChangedSubject.asObservable();

  notifyCatalogChanged(): void {
    this.catalogChangedSubject.next();
  }
}
