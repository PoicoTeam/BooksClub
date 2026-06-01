import { User } from './user.model';

export interface RegisterPayload {
  username: string;
  password: string;
  ruolo?: User['ruolo'];
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthSuccessResponse {
  status: 'success';
  username?: string;
  ruolo?: User['ruolo'];
  message?: string;
}

export interface SessionResponse {
  logged: boolean;
  username?: string;
  ruolo?: User['ruolo'];
}

export interface ApiErrorBody {
  error?: string;
  message?: string;
}
