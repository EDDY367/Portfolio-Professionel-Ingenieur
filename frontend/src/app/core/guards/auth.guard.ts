import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.token ? true : inject(Router).createUrlTree(['/admin/login']);
};

/** Évite d'afficher le formulaire de connexion à quelqu'un déjà connecté. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.token ? inject(Router).createUrlTree(['/admin']) : true;
};
