export type BookStato = 'da_leggere' | 'in_lettura' | 'letto';

export interface Book {
  _id?: string;
  titolo: string;
  autore: string;
  anno?: number | null;
  editore?: string;
  isbn?: string;
  descrizione?: string;
  genere?: string;
  stato?: BookStato;
  preferito?: boolean;
  voto?: number | null;
  copertina?: string;
  /** Usato solo in UI quando il caricamento dell'immagine fallisce */
  copertinaFallita?: boolean;
}

export interface BookPayload {
  titolo: string;
  autore: string;
  anno?: number | null;
  editore?: string;
  isbn?: string;
  descrizione?: string;
  genere?: string;
  stato?: BookStato;
  preferito?: boolean;
  voto?: number | null;
  copertina?: string;
}

export interface BookStats {
  totale_libri: number;
  letti: number;
  da_leggere: number;
  in_lettura: number;
  preferiti: number;
}

export interface BookMutationResponse {
  status: string;
  id?: string;
  message?: string;
}
