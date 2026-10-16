import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Profile, ProfileRequest } from '../../core/models/api.models';
import { AdminApiService } from '../../core/services/admin-api.service';
import { toApiError } from '../../core/services/api-error';
import { AdminStore } from '../admin-store';
import { AdminUi } from '../admin-ui';
import { URL_RE } from '../resources';

type Key = keyof ProfileRequest;

@Component({
  selector: 'app-profile-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-title">
      <div><p>CONTENU / PROFIL</p><h1>Profil</h1><span>Informations principales affichées en haut de votre portfolio.</span></div>
    </div>
    @if (loading()) {
      <div class="profile-card"><div class="empty-state"><span class="spinner"></span><span>Chargement…</span></div></div>
    } @else {
      <form class="profile-card admin-modal-like" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        @if (isNew()) { <p class="hint-banner">Aucun profil n’existe encore : remplissez ce formulaire pour le créer.</p> }
        <div class="form-grid">
          <label class="half">Nom complet <b class="req">*</b><input formControlName="fullName" maxlength="120" [attr.aria-invalid]="bad('fullName')" />
            @if (bad('fullName')) { <small class="error">{{ msg('fullName') }}</small> }</label>
          <label class="half">Titre / accroche <b class="req">*</b><input formControlName="headline" maxlength="200" [attr.aria-invalid]="bad('headline')" />
            @if (bad('headline')) { <small class="error">{{ msg('headline') }}</small> }</label>
          <label class="full">Biographie<textarea formControlName="bio" rows="6" maxlength="4000" [attr.aria-invalid]="bad('bio')"></textarea>
            <small class="hint">Un retour à la ligne crée un nouveau paragraphe dans la section « À propos ».</small>
            @if (bad('bio')) { <small class="error">{{ msg('bio') }}</small> }</label>
          <label class="half">Email<input type="email" formControlName="email" maxlength="200" [attr.aria-invalid]="bad('email')" />
            @if (bad('email')) { <small class="error">{{ msg('email') }}</small> }</label>
          <label class="half">Téléphone<input formControlName="phone" maxlength="40" /></label>
          <label class="full">Localisation<input formControlName="location" maxlength="120" placeholder="Abidjan, Côte d’Ivoire" /></label>
          <label class="half">Photo (URL)<input type="url" formControlName="photoUrl" placeholder="https://…" [attr.aria-invalid]="bad('photoUrl')" />
            <small class="hint">Vide = photo par défaut du site. L’API exige une URL http(s).</small>
            @if (bad('photoUrl')) { <small class="error">{{ msg('photoUrl') }}</small> }</label>
          <label class="half">CV (URL)<input type="url" formControlName="cvUrl" placeholder="https://…" [attr.aria-invalid]="bad('cvUrl')" />
            @if (bad('cvUrl')) { <small class="error">{{ msg('cvUrl') }}</small> }</label>
        </div>
        @if (error()) { <p class="error-message" role="alert">{{ error() }}</p> }
        <div class="modal-actions">
          <button class="button primary" type="submit" [disabled]="saving()">{{ saving() ? 'Enregistrement…' : 'Enregistrer le profil' }}</button>
        </div>
      </form>
    }
  `,
})
export class ProfileEditorComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly store = inject(AdminStore);
  private readonly ui = inject(AdminUi);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly isNew = signal(false);
  protected readonly error = signal('');
  private readonly serverErrors = signal<Record<string, string>>({});
  private readonly submitted = signal(false);

  protected readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    headline: ['', [Validators.required, Validators.maxLength(200)]],
    bio: ['', [Validators.maxLength(4000)]],
    email: ['', [Validators.email, Validators.maxLength(200)]],
    phone: ['', [Validators.maxLength(40)]],
    location: ['', [Validators.maxLength(120)]],
    photoUrl: ['', [Validators.pattern(URL_RE), Validators.maxLength(500)]],
    cvUrl: ['', [Validators.pattern(URL_RE), Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.api.profile().subscribe({
      next: (p) => { this.patch(p); this.loading.set(false); },
      error: (e: unknown) => {
        // 404 = aucun profil créé : le formulaire reste vide et un PUT le créera.
        if (e instanceof HttpErrorResponse && e.status === 404) this.isNew.set(true);
        else this.ui.toast('err', toApiError(e).message);
        this.loading.set(false);
      },
    });
  }

  private patch(p: Profile): void {
    this.form.patchValue({
      fullName: p.fullName, headline: p.headline, bio: p.bio ?? '', email: p.email ?? '', phone: p.phone ?? '',
      location: p.location ?? '', photoUrl: p.photoUrl ?? '', cvUrl: p.cvUrl ?? '',
    });
  }

  protected bad(k: Key): boolean {
    const c = this.form.controls[k];
    return !!this.serverErrors()[k] || ((c.touched || this.submitted()) && c.invalid);
  }

  protected msg(k: Key): string {
    const s = this.serverErrors()[k];
    if (s) return s;
    const e = this.form.controls[k].errors ?? {};
    if (e['required']) return 'Champ requis.';
    if (e['email']) return 'Email invalide.';
    if (e['pattern']) return 'URL http(s) invalide.';
    if (e['maxlength']) return 'Texte trop long.';
    return 'Valeur invalide.';
  }

  protected submit(): void {
    this.submitted.set(true);
    this.error.set('');
    this.serverErrors.set({});
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;

    const raw = this.form.getRawValue();
    const orNull = (s: string) => (s.trim() === '' ? null : s.trim()); // '' → null (sinon @Email/@Pattern échouent)
    const body: ProfileRequest = {
      fullName: raw.fullName.trim(), headline: raw.headline.trim(), bio: orNull(raw.bio), email: orNull(raw.email),
      phone: orNull(raw.phone), location: orNull(raw.location), photoUrl: orNull(raw.photoUrl), cvUrl: orNull(raw.cvUrl),
    };
    this.saving.set(true);
    this.api.saveProfile(body).subscribe({
      next: (p) => {
        this.saving.set(false);
        this.isNew.set(false);
        this.store.profile.set(p);
        this.ui.toast('ok', 'Profil enregistré.');
      },
      error: (err) => {
        const e = toApiError(err);
        this.saving.set(false);
        this.serverErrors.set(e.fieldErrors);
        this.error.set(Object.keys(e.fieldErrors).length ? '' : e.message);
      },
    });
  }
}
