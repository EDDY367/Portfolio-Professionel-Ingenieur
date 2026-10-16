import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, TokenResponse } from '../models/api.models';

const TOKEN_KEY = 'portfolio.token';
const EMAIL_KEY = 'portfolio.email';

/** Décode le payload d'un JWT (sans vérifier la signature : c'est le rôle du serveur). */
function decode(token: string): { exp?: number; sub?: string } | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(this.restore());
  readonly email = signal<string | null>(sessionStorage.getItem(EMAIL_KEY));
  readonly isAuthenticated = computed(() => this._token() !== null);

  /** Jeton valide ou null (et déconnexion silencieuse s'il a expiré). */
  get token(): string | null {
    const t = this._token();
    if (t && this.expired(t)) { this.clear(); return null; }
    return t;
  }

  login(credentials: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        // sessionStorage : le jeton disparaît à la fermeture de l'onglet (plus prudent que localStorage).
        sessionStorage.setItem(TOKEN_KEY, res.accessToken);
        sessionStorage.setItem(EMAIL_KEY, credentials.email);
        this._token.set(res.accessToken);
        this.email.set(credentials.email);
      }),
    );
  }

  logout(redirect = true): void {
    this.clear();
    if (redirect) this.router.navigate(['/admin/login']);
  }

  private clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EMAIL_KEY);
    this._token.set(null);
    this.email.set(null);
  }

  private restore(): string | null {
    const t = sessionStorage.getItem(TOKEN_KEY);
    if (t && this.expired(t)) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(EMAIL_KEY);
      return null;
    }
    return t;
  }

  private expired(token: string): boolean {
    const exp = decode(token)?.exp;
    return !exp || exp * 1000 <= Date.now() + 5_000;
  }
}
