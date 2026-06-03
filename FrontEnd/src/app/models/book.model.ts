/*
  MODELLI LIBRO (Book)
  Allineati ai documenti MongoDB e alle risposte di APIController.
*/

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
  /** flag solo frontend: true se l'URL copertina non carica l'immagine */
  copertinaFallita?: boolean;
}




// risposta GET /stats
export interface BookStats {
  totale_libri: number;
  letti: number;
  da_leggere: number;
  in_lettura: number;
  preferiti: number;
}

// body per POST /books e PUT /books/{id}
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

export interface BookMutationResponse {
  status: string;
  id?: string;
  message?: string;
}
