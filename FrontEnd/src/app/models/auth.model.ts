import { User } from './user.model';

/*
  MODELLI AUTENTICAZIONE
  Tipi per payload e risposte JSON di AuthController (register, login, check-session).
*/

export interface RegisterPayload {
  username: string;
  password: string;
}


export interface ApiErrorBody {
  error?: string;
  message?: string;
}


export interface LoginPayload {
  username: string;
  password: string;
}



export interface SessionResponse {
  logged: boolean;
  username?: string;
  ruolo?: User['ruolo'];
}



export interface AuthSuccessResponse {
  status: 'success';
  username?: string;
  ruolo?: User['ruolo'];
  message?: string;
}