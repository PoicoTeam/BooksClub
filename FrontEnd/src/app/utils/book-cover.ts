import { Book } from '../models/book.model';

export const BOOK_COVER_PLACEHOLDER = '📖';

/*
  HELPER COPERTINA (book-cover)
  Gestisce il fallback visivo quando manca l'URL o il caricamento immagine fallisce.
*/

export function markCoverFailed(book: Book): void {
  book.copertinaFallita = true;
}

export function shouldShowCover(book: Book): boolean {
  return !!book.copertina?.trim() && !book.copertinaFallita;
}
