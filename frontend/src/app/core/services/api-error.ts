import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '../models/api.models';

export interface ApiError {
  status: number;
  message: string;
  fieldErrors: Record<string, string>;
}

/** Transforme n'importe quelle erreur HTTP en message lisible en français. */
export function toApiError(err: unknown): ApiError {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return { status: 0, message: 'Impossible de joindre le serveur. Vérifiez votre connexion.', fieldErrors: {} };
    }
    const pd = (err.error ?? {}) as ProblemDetail;
    const fieldErrors = pd.errors ?? {};
    let message = pd.detail || pd.title || 'Une erreur est survenue.';
    if (err.status === 429) message = 'Trop de tentatives. Réessayez un peu plus tard.';
    if (err.status === 403) message = "Vous n'avez pas les droits nécessaires.";
    if (err.status >= 500) message = 'Erreur du serveur. Réessayez plus tard.';
    return { status: err.status, message, fieldErrors };
  }
  return { status: -1, message: 'Une erreur inattendue est survenue.', fieldErrors: {} };
}
