import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioStore } from '../core/services/portfolio-store';
import { PublicApiService } from '../core/services/public-api.service';
import { toApiError } from '../core/services/api-error';
import { IconComponent } from '../shared/icon';

type Field = 'name' | 'email' | 'body';

@Component({
  selector: 'app-contact-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent],
  template: `
    <section class="contact-section" id="contact">
      <div class="contact-copy">
        <p class="eyebrow"><span></span>Contact</p>
        <h2>Construisons quelque<br />chose de <em>solide.</em></h2>
        <p>Une idée, un projet, une opportunité de stage ? Écrivez-moi, je réponds généralement sous 48 heures.</p>
        @if (email(); as mail) {
          <a class="email-link" [href]="'mailto:' + mail"><app-icon name="mail" /> {{ mail }}</a>
        }
      </div>

      <form class="contact-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label>Votre nom
          <input formControlName="name" autocomplete="name" placeholder="Ex. Marie Kouassi" [attr.aria-invalid]="invalid('name')" />
          @if (invalid('name')) { <small class="error">{{ message('name') }}</small> }
        </label>
        <label>Votre email
          <input type="email" formControlName="email" autocomplete="email" placeholder="marie@entreprise.com" [attr.aria-invalid]="invalid('email')" />
          @if (invalid('email')) { <small class="error">{{ message('email') }}</small> }
        </label>
        <label>Objet <span class="optional">(facultatif)</span>
          <input formControlName="subject" placeholder="Opportunité, projet…" />
        </label>
        <label>Parlez-moi de votre projet
          <textarea formControlName="body" rows="4" placeholder="Quelques mots sur votre besoin, vos objectifs..." [attr.aria-invalid]="invalid('body')"></textarea>
          @if (invalid('body')) { <small class="error">{{ message('body') }}</small> }
        </label>

        <!-- Pot de miel : invisible pour un humain, les robots le remplissent (cf. MessageDto.ContactRequest). -->
        <div class="hp" aria-hidden="true">
          <label>Ne pas remplir <input formControlName="website" tabindex="-1" autocomplete="off" /></label>
        </div>

        <button class="button primary submit-button" type="submit" [disabled]="sending()">
          {{ sending() ? 'Envoi en cours…' : 'Envoyer le message' }} <app-icon name="send" />
        </button>
        @if (sent()) { <p class="success-message" role="status"><app-icon name="check" /> Merci, votre message a bien été envoyé.</p> }
        @if (error()) { <p class="error-message" role="alert">{{ error() }}</p> }
      </form>
    </section>
  `,
})
export class ContactSectionComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly api = inject(PublicApiService);
  private readonly store = inject(PortfolioStore);

  protected readonly email = computed(() => this.store.profile()?.email);
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal('');
  private readonly serverErrors = signal<Record<string, string>>({});
  private readonly submitted = signal(false);

  // Mêmes règles que le backend : name ≤ 120, email valide ≤ 200, body 10–4000.
  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    subject: ['', [Validators.maxLength(200)]],
    body: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(4000)]],
    website: [''],
  });

  protected invalid(f: Field): boolean {
    const c = this.form.controls[f];
    return !!this.serverErrors()[f] || ((c.touched || this.submitted()) && c.invalid);
  }

  protected message(f: Field): string {
    const server = this.serverErrors()[f];
    if (server) return server;
    const e = this.form.controls[f].errors ?? {};
    if (f === 'name') return 'Indiquez votre nom.';
    if (f === 'email') return 'Saisissez un email valide.';
    if (e['maxlength']) return 'Message trop long (4000 caractères maximum).';
    return 'Votre message doit contenir au moins 10 caractères.';
  }

  protected submit(): void {
    this.submitted.set(true);
    this.sent.set(false);
    this.error.set('');
    this.serverErrors.set({});
    this.form.markAllAsTouched();
    if (this.form.invalid || this.sending()) return;

    const { name, email, subject, body, website } = this.form.getRawValue();
    this.sending.set(true);
    this.api.sendContact({ name: name.trim(), email: email.trim(), subject: subject.trim() || null, body: body.trim(), website }).subscribe({
      next: () => {
        this.sending.set(false);
        this.sent.set(true);
        this.submitted.set(false);
        this.form.reset();
      },
      error: (err) => {
        const e = toApiError(err);
        this.sending.set(false);
        this.serverErrors.set(e.fieldErrors);
        this.error.set(Object.keys(e.fieldErrors).length ? '' : e.message);
      },
    });
  }
}
