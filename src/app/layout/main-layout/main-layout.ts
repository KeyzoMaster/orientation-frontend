import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, MatButtonModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss', // Optionnel si vous voulez du CSS spécifique
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  
  // Signaux exposés pour le template
  readonly isAdmin = this.authService.isAdmin;
  readonly currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout();
  }
}