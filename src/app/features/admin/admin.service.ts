import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Filiere, Specialite, UE } from './admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/admin';

  // State (Signals) pour rafraîchir la liste automatiquement
  private readonly _filieres = signal<Filiere[]>([]);
  readonly filieres = this._filieres.asReadonly();

  loadFilieres() {
    this.http.get<Filiere[]>(`${this.apiUrl}/filieres`).subscribe(data => {
      this._filieres.set(data);
    });
  }

  createFiliere(filiere: Filiere) {
    return this.http.post<Filiere>(`${this.apiUrl}/filieres`, filiere).pipe(
      tap(() => this.loadFilieres()) // Recharger la liste après ajout
    );
  }

  createSpecialite(spec: Specialite) {
    return this.http.post<Specialite>(`${this.apiUrl}/specialites`, spec).pipe(
      tap(() => this.loadFilieres())
    );
  }

  createUE(ue: UE) {
    return this.http.post<UE>(`${this.apiUrl}/ues`, ue);
  }
}