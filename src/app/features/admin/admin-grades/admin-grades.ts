import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../admin.service';
import { SaisieNoteRequest } from '../admin.models';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-admin-grades',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatSnackBarModule,
    MatIcon
],
  templateUrl: './admin-grades.html'
})
export class AdminGrades {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly snackBar = inject(MatSnackBar);
  
  readonly isSubmitting = signal(false);

  readonly gradeForm = this.fb.nonNullable.group({
    inscriptionId: [0, [Validators.required, Validators.min(1)]],
    codeUE: ['', Validators.required],
    nomEC: ['', Validators.required],
    note: [10, [Validators.required, Validators.min(0), Validators.max(20)]],
    session: ['NORMALE' as const, Validators.required]
  });

  submitGrade() {
    if (this.gradeForm.invalid) return;
    this.isSubmitting.set(true);
    
    const request: SaisieNoteRequest = {
      ...this.gradeForm.getRawValue(),
      session: this.gradeForm.getRawValue().session as 'NORMALE' | 'RATTRAPAGE'
    };

    this.adminService.saisirNote(request).subscribe({
      next: (res) => {
        this.snackBar.open(`Note enregistrée : ${res.valeur}/20`, 'OK', { duration: 3000 });
        // On garde l'ID et l'UE pour enchainer rapidement les saisies d'EC
        this.gradeForm.patchValue({ nomEC: '', note: 10 });
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors de la saisie', 'Fermer');
        this.isSubmitting.set(false);
      }
    });
  }
}