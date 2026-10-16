import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { toApiError } from '../core/services/api-error';
import { BrandComponent } from '../shared/brand';
import { IconComponent } from '../shared/icon';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandComponent, ReactiveFormsModule, RouterLink, IconComponent],
  template: `
    <div class="login-shell">
      <button class="icon-button login-theme" (click)="theme.toggle()" [attr.aria-label]="theme.dark() ? 'Activer le mode clair' : 'Activer le mode sombre'">
        <app-icon [name]="theme.dark() ? 'sun' : 'moon'" />
      </button>
      <form class="login-card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <a class="brand login-brand" routerLink="/"><app-brand /></a>
        <p class="eyebrow"><span></span>Espace administrateur</p>
        <h1>Connexion</h1>
        <label>Email
          <input type="email" formControlName="email" autocomplete="username" placeholder="vous@exemple.com" [attr.aria-invalid]="showErr('email')" />
          @if (showErr('email')) { <small class="error">Saisissez un email valide.</small> }
        </label>
        <label>Mot de passe
          <input type="password" formControlName="password" autocomplete="current-password" placeholder="••••••••••••" [attr.aria-invalid]="showErr('password')" />
          @if (showErr('password')) { <small class="error">Saisissez votre mot de passe.</small> }
        </label>
        @if (error()) { <p class="error-message" role="alert">{{ error() }}</p> }
        <button class="button primary submit-button" type="submit" [disabled]="loading()">{{ loading() ? 'Connexion…' : 'Se connecter' }} <app-icon name="arrow" /></button>
        <a class="back-link" routerLink="/">← Retour au portfolio</a>
      </form>
    </div>
  `,
})
export class LoginComponent {
  protected readonly theme = inject(ThemeService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly loading = signal(false);
  protected readonly error = signal('');
  private readonly submitted = signal(false);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    password: ['', [Validators.required, Validators.maxLength(72)]],
  });

  protected showErr(k: 'email' | 'password'): boolean {
    const c = this.form.controls[k];
    return (c.touched || this.submitted()) && c.invalid;
  }

  protected submit(): void {
    this.submitted.set(true);
    this.error.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();
    this.auth.login({ email: email.trim(), password }).subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: (err) => {
        const e = toApiError(err);
        this.loading.set(false);
        this.form.controls.password.reset('');
        this.error.set(e.status === 401 ? 'Email ou mot de passe incorrect.' : e.message);
      },
    });
  }
}
