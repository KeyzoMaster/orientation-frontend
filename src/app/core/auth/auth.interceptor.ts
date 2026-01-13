import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  // Si on a un token, on clone la requête pour l'ajouter aux headers
  let request = req;
  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error) => {
      // Si on reçoit une 401 (Non autorisé) ou 403 (Interdit), on déconnecte
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};