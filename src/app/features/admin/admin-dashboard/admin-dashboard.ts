import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
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
import { Filiere, Specialite, MaquetteSemestre } from '../admin.models';

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

  readonly filieres = this.adminService.filieres;
  readonly isSubmitting = signal(false);

  // --- Sélecteurs pour création UE ---
  readonly selectedFiliereId = signal<number | null>(null);
  readonly selectedSpecId = signal<number | null>(null);
  
  // Calcul des listes dynamiques pour les dropdowns
  readonly specialitesDisponibles = computed(() => {
    const fil = this.filieres().find(f => f.id === this.selectedFiliereId());
    return fil?.specialites || [];
  });

  // Note: Dans une vraie app, on chargerait les maquettes via API. 
  // Ici on mock les maquettes standards L1-M2 si elles ne sont pas dans le modèle Specialite
  readonly maquettesDisponibles = signal<MaquetteSemestre[]>([
    { id: 1, libelle: 'L1 S1', semestre: 'L_S1' },
    { id: 2, libelle: 'L1 S2', semestre: 'L_S2' },
    { id: 3, libelle: 'L2 S3', semestre: 'L_S3' },
    { id: 4, libelle: 'L2 S4', semestre: 'L_S4' },
    { id: 5, libelle: 'L3 S5 GL', semestre: 'L_S5' },
    { id: 6, libelle: 'L3 S6 GL', semestre: 'L_S6' }
  ]);

  // --- FORMS ---
  readonly filiereForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    libelle: ['', Validators.required]
  });

  readonly specialiteForm = this.fb.nonNullable.group({
    filiereId: [0, Validators.required],
    code: ['', Validators.required],
    libelle: ['', Validators.required]
  });

  readonly ueForm = this.fb.group({
    maquetteId: [0, Validators.required], // ID du semestre (L_S1, etc.)
    code: ['', Validators.required],
    libelle: ['', Validators.required],
    credits: [6, [Validators.required, Validators.min(1)]],
    coefficient: [3, [Validators.required, Validators.min(1)]],
    domaine: ['dev', Validators.required],
    ecs: this.fb.array([])
  });

  readonly seedEmailControl = this.fb.control('', [Validators.required, Validators.email]);

  ngOnInit() {
    this.adminService.loadFilieres();
    this.addEcField();
  }

  // --- ACTIONS ---

  submitFiliere() {
    if (this.filiereForm.invalid) return;
    this.isSubmitting.set(true);
    this.adminService.createFiliere(this.filiereForm.getRawValue()).subscribe({
      next: () => this.handleSuccess('Filière créée', this.filiereForm),
      error: () => this.isSubmitting.set(false)
    });
  }

  submitSpecialite() {
    if (this.specialiteForm.invalid) return;
    this.isSubmitting.set(true);
    const { filiereId, code, libelle } = this.specialiteForm.getRawValue();
    
    // On passe l'objet partiel attendu par le service
    this.adminService.createSpecialite(filiereId, { code, libelle }).subscribe({
      next: () => this.handleSuccess('Spécialité ajoutée', this.specialiteForm),
      error: () => this.isSubmitting.set(false)
    });
  }

  submitUE() {
    if (this.ueForm.invalid) return;
    this.isSubmitting.set(true);

    const formValue = this.ueForm.value;
    const maquetteId = formValue.maquetteId!;
    
    // Nettoyage de l'objet UE pour l'API
    const uePayload: any = {
      code: formValue.code,
      libelle: formValue.libelle,
      credits: formValue.credits,
      coefficient: formValue.coefficient,
      domaine: formValue.domaine,
      ecs: formValue.ecs
    };

    this.adminService.addUE(maquetteId, uePayload).subscribe({
      next: () => {
        this.snackBar.open('UE ajoutée au semestre', 'OK', { duration: 3000 });
        this.isSubmitting.set(false);
        // Reset partiel
        this.ueForm.patchValue({ code: '', libelle: '' });
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  // --- HELPERS FORM ARRAY ---
  get ecsArray() { return this.ueForm.get('ecs') as FormArray; }
  
  addEcField() {
    this.ecsArray.push(this.fb.group({
      libelle: ['', Validators.required],
      coefficient: [1, Validators.required]
    }));
  }

  removeEcField(index: number) { this.ecsArray.removeAt(index); }

  private handleSuccess(msg: string, form: any) {
    this.snackBar.open(msg, 'OK', { duration: 2000 });
    form.reset();
    this.isSubmitting.set(false);
  }

  // Méthode pour le Seeder
  lancerSeeder() {
    this.isSubmitting.set(true);
    this.adminService.seedAnciens(50).subscribe({
      next: (res) => {
        this.snackBar.open(res, 'Fermer', { duration: 5000 });
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.snackBar.open('Erreur Seeder: ' + err.message, 'Fermer');
        this.isSubmitting.set(false);
      }
    });
  }

  lancerSeederEtudiant() {
    if (this.seedEmailControl.invalid) return;
    
    this.isSubmitting.set(true);
    const email = this.seedEmailControl.value!;

    this.adminService.seedParcoursEtudiant(email).subscribe({
      next: (res) => {
        this.snackBar.open(res, 'OK', { duration: 5000 });
        this.isSubmitting.set(false);
        this.seedEmailControl.reset();
      },
      error: (err) => {
        this.snackBar.open('Erreur : ' + err.message, 'Fermer');
        this.isSubmitting.set(false);
      }
    });
  }
}