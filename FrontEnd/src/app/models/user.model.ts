/*
  MODELLO UTENTE (User)
  Rappresenta l'utente loggato in sessione (username + ruolo dal backend PHP).
*/
export interface User {
  username: string;
  ruolo: 'user' | 'admin';
}
