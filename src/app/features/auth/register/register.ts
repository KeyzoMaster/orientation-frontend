import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';
import { UserRole } from '../../../core/models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);
  readonly roles: UserRole[] = ['ETUDIANT', 'ADMIN'];

  readonly registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['ETUDIANT' as UserRole, [Validators.required]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    const rawData = this.registerForm.getRawValue();

    this.authService.register(rawData).subscribe({
      next: () => {
        this.snackBar.open('Compte créé avec succès !', 'OK', { duration: 3000 });
        const route = rawData.role === 'ADMIN' ? '/admin' : '/student';
        this.router.navigate([route]);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Erreur lors de l\'inscription.', 'Fermer', { duration: 3000 });
      }
    });
  }
}