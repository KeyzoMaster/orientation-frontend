import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, 
    MatProgressBarModule, MatTableModule, MatChipsModule
  ],
  templateUrl: './student-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboard implements OnInit {
  private readonly studentService = inject(StudentService);

  readonly simulation = this.studentService.simulationResult;
  readonly notes = this.studentService.dernieresNotes;
  readonly isLoading = this.studentService.isLoading;
  readonly parcours = this.studentService.parcours;

  readonly displayedColumns: string[] = ['matiere', 'note', 'ue'];

  ngOnInit() {
    this.studentService.loadParcours();
  }

  lancerIA() {
    this.studentService.lancerSimulation().subscribe();
  }

  getNoteColor(note: number): string {
    if (note >= 16) return 'text-green-700 font-bold';
    if (note >= 10) return 'text-blue-600 font-medium';
    return 'text-red-600 font-medium';
  }
}