import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StudentService, Note } from '../student.service';

@Component({
  selector: 'app-student-notes',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatExpansionModule, MatTableModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './student-notes.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentNotes implements OnInit {
  private readonly studentService = inject(StudentService);
  
  // On récupère les notes depuis le service
  readonly notes = this.studentService.notes;

  // Colonnes pour les tableaux
  readonly displayedColumns = ['matiere', 'session', 'note', 'decision'];

  ngOnInit() {
    this.studentService.loadNotes();
  }

  // Helper pour regrouper les notes par année (L1, L2...)
  // Dans un vrai cas, cela se ferait côté backend ou via un computed signal
  get notesByYear() {
    const allNotes = this.notes();
    const groups: { [key: string]: Note[] } = {};
    
    allNotes.forEach(n => {
      if (!groups[n.annee]) groups[n.annee] = [];
      groups[n.annee].push(n);
    });

    return Object.entries(groups).map(([year, notes]) => ({ year, notes }));
  }

  getDecision(note: number): string {
    return note >= 10 ? 'Validé' : 'Non Validé';
  }
}