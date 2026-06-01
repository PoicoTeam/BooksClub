import { Book } from '../models/book.model';

export const BOOK_COVER_PLACEHOLDER = '📖';

export function markCoverFailed(book: Book): void {
  book.copertinaFallita = true;
}

export function shouldShowCover(book: Book): boolean {
  return !!book.copertina?.trim() && !book.copertinaFallita;
}
