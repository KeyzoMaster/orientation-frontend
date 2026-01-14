import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Recommandation } from '../../core/models/simulation.models';
import { ParcoursDto, NoteDto } from '../../core/models/student.models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1';

  // --- STATE ---
  readonly simulationResult = signal<Recommandation | null>(null);
  readonly parcours = signal<ParcoursDto | null>(null);
  readonly isLoading = signal(false);

  // --- COMPUTED ---
  // Adaptation pour la nouvelle structure hiérarchique
  readonly dernieresNotes = computed(() => {
    const p = this.parcours();
    if (!p || !p.annees.length) return [];

    // On prend l'année la plus récente
    const lastYear = p.annees[p.annees.length - 1];
    
    // Extraction à plat des notes en parcourant Semestres -> UEs -> Notes
    const notes: any[] = [];
    
    if (lastYear.semestres) {
      lastYear.semestres.forEach(sem => {
        sem.ues.forEach(ue => {
          ue.notes.forEach(note => {
            notes.push({
              matiere: note.nomEC,
              note: note.valeur,
              ue: ue.codeUE,
              annee: sem.codeSemestre // Ex: L_S1
            });
          });
        });
      });
    }
    
    // On retourne les 5 dernières notes ajoutées (souvent les dernières du tableau)
    // Note: Idéalement, le backend devrait renvoyer une date de saisie pour trier
    return notes.slice(-5).reverse(); 
  });

  // --- ACTIONS ---

  loadParcours() {
    this.http.get<ParcoursDto>(`${this.apiUrl}/etudiant/parcours`).subscribe({
      next: (data) => this.parcours.set(data),
      error: (err) => console.error('Erreur chargement parcours', err)
    });
  }

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
}