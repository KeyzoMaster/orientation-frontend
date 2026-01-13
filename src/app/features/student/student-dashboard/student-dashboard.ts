import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Pour les pipes de base
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule, MatIconModule, 
    MatProgressBarModule, MatDividerModule, MatTableModule, MatChipsModule
  ],
  templateUrl: './student-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboard implements OnInit {
  private readonly studentService = inject(StudentService);

  // Exposition des Signals au template
  readonly simulation = this.studentService.simulationResult;
  readonly notes = this.studentService.notes;
  readonly isLoading = this.studentService.isLoading;

  readonly displayedColumns: string[] = ['annee', 'matiere', 'note', 'session'];

  ngOnInit() {
    this.studentService.loadNotes();
  }

  lancerIA() {
    this.studentService.lancerSimulation().subscribe();
  }

  // Helper pour la couleur des notes
  getNoteColor(note: number): string {
    if (note >= 16) return 'text-green-600 font-bold';
    if (note >= 10) return 'text-blue-600';
    return 'text-red-600';
  }
}