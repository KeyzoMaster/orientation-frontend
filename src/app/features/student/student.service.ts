import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Recommandation } from '../../core/models/simulation.models'; // Assurez-vous d'avoir ce modèle
// import { environment } from '../../../environments/environment';

export interface Note {
  matiere: string;
  note: number;
  session: string;
  annee: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1';

  // State (Signals)
  readonly simulationResult = signal<Recommandation | null>(null);
  readonly notes = signal<Note[]>([]); // Simulation de données pour l'instant si pas d'endpoint notes
  readonly isLoading = signal(false);

  // Lancer la simulation (Appel Prolog via Java)
  lancerSimulation() {
    this.isLoading.set(true);
    return this.http.post<Recommandation>(`${this.apiUrl}/simulation/lancer`, {}).pipe(
      tap({
        next: (result) => {
          this.simulationResult.set(result);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      })
    );
  }

  // Récupérer les notes (À implémenter côté backend si ce n'est pas fait, ici je mock pour l'affichage)
  loadNotes() {
    // TODO: Remplacer par un vrai appel HTTP GET /api/v1/student/notes
    // Pour l'instant, on simule des données locales pour tester l'UI
    this.notes.set([
      { matiere: 'Algorithmique', note: 16.5, session: 'Normale', annee: 'L2' },
      { matiere: 'Bases de données', note: 14.0, session: 'Normale', annee: 'L2' },
      { matiere: 'Probabilités', note: 11.0, session: 'Rattrapage', annee: 'L1' },
      { matiere: 'Développement Web', note: 17.0, session: 'Normale', annee: 'L3' },
    ]);
  }
}