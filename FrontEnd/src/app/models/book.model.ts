export interface Book {
  _id?: string;
  titolo: string;
  autore: string;
  anno?: number;
  stato?: string;
  preferito?: boolean;
}
