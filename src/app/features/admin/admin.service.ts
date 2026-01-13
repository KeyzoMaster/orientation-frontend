import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { 
  Filiere, Specialite, UE, 
  InscriptionAdministrativeRequest, SaisieNoteRequest, NoteResponse 
} from './admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/admin';

  // State pour rafraîchir la liste automatiquement
  private readonly _filieres = signal<Filiere[]>([]);
  readonly filieres = this._filieres.asReadonly();

  loadFilieres() {
    return this.http.get<Filiere[]>(`${this.apiUrl}/filieres`).subscribe(data => {
      this._filieres.set(data);
    });
  }

  createFiliere(filiere: Filiere) {
    return this.http.post<Filiere>(`${this.apiUrl}/filieres`, filiere).pipe(
      tap(() => this.loadFilieres())
    );
  }

  // Correction URL selon AdminController : /filieres/{filiereId}/specialites
  createSpecialite(filiereId: number, spec: Specialite) {
    return this.http.post<Specialite>(`${this.apiUrl}/filieres/${filiereId}/specialites`, spec).pipe(
      tap(() => this.loadFilieres())
    );
  }

  // Correction URL selon AdminController : /maquettes/{maquetteId}/ues
  addUE(maquetteId: number, ue: UE) {
    return this.http.post<UE>(`${this.apiUrl}/maquettes/${maquetteId}/ues`, ue);
  }

  // --- GESTION PEDAGOGIQUE ---

  inscrireEtudiant(request: InscriptionAdministrativeRequest) {
    return this.http.post(`${this.apiUrl}/inscriptions`, request, { responseType: 'text' });
  }

  saisirNote(request: SaisieNoteRequest) {
    return this.http.post<NoteResponse>(`${this.apiUrl}/notes`, request);
  }

  // --- SEEDER (Données de test) ---
  // Correspond à SeederController
  seedAnciens(nombre: number = 50) {
    return this.http.post(`${this.apiUrl}/seed/anciens?nombre=${nombre}`, {}, { responseType: 'text' });
  }

  seedParcoursEtudiant(email: string) {
    return this.http.post(`${this.apiUrl}/seed/parcours?email=${email}`, {}, { responseType: 'text' });
  }
}