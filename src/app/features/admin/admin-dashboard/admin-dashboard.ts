import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminService } from '../admin.service';
import { Filiere } from '../admin.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabsModule, MatCardModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatIconModule, MatExpansionModule, MatSelectModule, MatSnackBarModule,
  ],
  templateUrl: './admin-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  readonly filieres = this.adminService.filieres;
  readonly isSubmitting = signal(false);

  // --- FORMULAIRE 1 : Filière ---
  readonly filiereForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    libelle: ['', Validators.required]
  });

  // --- FORMULAIRE 2 : Spécialité ---
  readonly specialiteForm = this.fb.nonNullable.group({
    filiereId: [0, Validators.required], // Sera un select
    code: ['', Validators.required],
    libelle: ['', Validators.required]
  });

  // --- FORMULAIRE 3 : UE & ECs (Complexe) ---
  readonly ueForm = this.fb.group({
    code: ['', Validators.required],
    libelle: ['', Validators.required],
    credits: [6, [Validators.required, Validators.min(1)]],
    coefficient: [3, [Validators.required, Validators.min(1)]],
    domaine: ['dev', Validators.required],
    ecs: this.fb.array([]) // FormArray pour les ECs dynamiques
  });

  ngOnInit() {
    this.adminService.loadFilieres();
    this.addEcField(); // Ajouter un EC par défaut
  }

  // --- ACTIONS FILIERE ---
  submitFiliere() {
    if (this.filiereForm.invalid) return;
    this.isSubmitting.set(true);

    this.adminService.createFiliere(this.filiereForm.getRawValue()).subscribe({
      next: () => {
        this.snackBar.open('Filière créée', 'OK', { duration: 2000 });
        this.filiereForm.reset();
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  submitSpecialite() {
    if (this.specialiteForm.invalid) return;
    this.isSubmitting.set(true);
    const { filiereId, code, libelle } = this.specialiteForm.getRawValue();

    // Mapping pour l'API qui attend un objet Filiere partiel
    const payload = { 
      code, 
      libelle, 
      filiere: { id: filiereId } as Filiere 
    };

    this.adminService.createSpecialite(payload).subscribe({
      next: () => {
        this.snackBar.open('Spécialité ajoutée', 'OK', { duration: 2000 });
        this.specialiteForm.reset(); // Attention à ne pas reset le filiereId si on veut enchaîner
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  // --- LOGIQUE UE / ECs ---
  
  get ecsArray() {
    return this.ueForm.get('ecs') as FormArray;
  }

  addEcField() {
    const ecGroup = this.fb.group({
      libelle: ['', Validators.required],
      coefficient: [1, [Validators.required, Validators.min(0.5)]]
    });
    this.ecsArray.push(ecGroup);
  }

  removeEcField(index: number) {
    this.ecsArray.removeAt(index);
  }

  submitUE() {
    if (this.ueForm.invalid) return;
    this.isSubmitting.set(true);

    // TypeScript strict checking workaround for FormArray value
    const rawValue = this.ueForm.value as any; 

    this.adminService.createUE(rawValue).subscribe({
      next: () => {
        this.snackBar.open('UE et ECs créés avec succès', 'OK', { duration: 3000 });
        this.ueForm.reset({ credits: 6, coefficient: 3, domaine: 'dev' });
        this.ecsArray.clear();
        this.addEcField();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur création UE', 'Fermer');
        this.isSubmitting.set(false);
      }
    });
  }
}