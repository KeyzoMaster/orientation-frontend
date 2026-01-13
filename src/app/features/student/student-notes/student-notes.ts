import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StudentService } from '../student.service';

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
  
  readonly parcours = this.studentService.parcours;

  ngOnInit() {
    // On recharge pour être sûr d'avoir les données à jour
    this.studentService.loadParcours();
  }

  // Statut UE (Validé/Dette)
  getUEStatusColor(statut: string): string {
    switch(statut) {
      case 'VALIDE': return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPENSE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACQUIS_ANTERIEUR': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-red-50 text-red-600 border-red-100'; // EN_COURS, AJOURNE
    }
  }

  getDecisionLabel(decision: string): string {
    return decision?.replace('_', ' ') || 'EN COURS';
  }
}