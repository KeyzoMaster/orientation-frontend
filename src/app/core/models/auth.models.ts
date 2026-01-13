export type UserRole = 'ADMIN' | 'ETUDIANT';

export interface User {
  email: string;
  role: UserRole;
  // Ajoutez d'autres champs si le backend les renvoie (nom, prenom, id...)
}

export interface AuthResponse {
  token: string;
  role: UserRole;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}