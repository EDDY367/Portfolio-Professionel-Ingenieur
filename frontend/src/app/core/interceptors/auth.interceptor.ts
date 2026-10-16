import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

const ADMIN_URL = `${environment.apiUrl}/admin`;

/**
 * Ajoute « Authorization: Bearer » uniquement sur /admin (le jeton n'est jamais envoyé ailleurs)
 * et déconnecte si le serveur répond 401 (jeton expiré ou invalide).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(ADMIN_URL)) return next(req);

  const auth = inject(AuthService);
  const token = auth.token;
  const authed = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authed).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) auth.logout();
      return throwError(() => err);
    }),
  );
};
