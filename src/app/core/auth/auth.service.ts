import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  // URL de l'API (à mettre idéalement dans environment.ts)
  private readonly apiUrl = 'http://localhost:8080/api/v1/auth';

  // --- STATE (SIGNALS) ---
  // On initialise avec les données du localStorage si elles existent
  private readonly _token = signal<string | null>(localStorage.getItem('token'));
  private readonly _currentUser = signal<User | null>(this.getUserFromStorage());

  // --- COMPUTED VALUES (DERIVED STATE) ---
  readonly token = this._token.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');
  readonly isStudent = computed(() => this._currentUser()?.role === 'ETUDIANT');

  // --- ACTIONS ---

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout() {
    // Nettoyage complet
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  // --- PRIVATE HELPERS ---

  private handleAuthSuccess(response: AuthResponse) {
    // 1. Sauvegarde dans le localStorage (Persistance)
    localStorage.setItem('token', response.token);
    
    const user: User = { email: response.email, role: response.role };
    localStorage.setItem('user', JSON.stringify(user));

    // 2. Mise à jour des Signals (Réactivité)
    this._token.set(response.token);
    this._currentUser.set(user);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}