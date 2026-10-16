import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject, input, output, signal } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { toApiError } from '../../core/services/api-error';
import { IconComponent } from '../../shared/icon';
import { AdminStore } from '../admin-store';
import { AdminUi } from '../admin-ui';
import { AdminItem, FieldDef, ResourceDef, URL_RE, toPayload } from '../resources';

/** Modale de création / modification générée à partir de la définition de la ressource. */
@Component({
  selector: 'app-resource-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent],
  template: `
    <div class="modal-backdrop" (mousedown)="closed.emit()">
      <form class="admin-modal" role="dialog" aria-modal="true" [formGroup]="form" (ngSubmit)="submit()" (mousedown)="$event.stopPropagation()" novalidate>
        <div class="modal-head">
          <div><span>{{ item() ? 'MODIFIER' : 'NOUVEAU' }}</span><h2>{{ def().singular }}</h2></div>
          <button type="button" (click)="closed.emit()" aria-label="Fermer"><app-icon name="close" /></button>
        </div>

        <div class="form-grid">
          @for (f of def().fields; track f.key) {
            @if (f.type === 'checkbox') {
              <label class="toggle-label" [class.half]="f.half" [class.full]="!f.half"><span class="lbl">{{ f.label }}</span>
                <button type="button" [class]="form.controls[f.key].value ? 'toggle on' : 'toggle'" (click)="flip(f.key)" role="switch" [attr.aria-checked]="!!form.controls[f.key].value"><i></i></button>
                <span>{{ form.controls[f.key].value ? 'Oui' : 'Non' }}</span>
              </label>
            } @else {
              <label [class.half]="f.half" [class.full]="!f.half">
                {{ f.label }}@if (f.required) { <b class="req">*</b> }
                @switch (f.type) {
                  @case ('textarea') { <textarea [formControlName]="f.key" [attr.name]="f.key" rows="3" [attr.maxlength]="f.max" [attr.aria-invalid]="bad(f)"></textarea> }
                  @case ('range') {
                    <span class="range-row"><input type="range" [formControlName]="f.key" [attr.name]="f.key" [min]="f.min ?? 0" [max]="f.max ?? 100" /><output>{{ form.controls[f.key].value }} %</output></span>
                  }
                  @case ('number') { <input type="number" [formControlName]="f.key" [attr.name]="f.key" [attr.min]="f.min" [attr.max]="f.max" [attr.aria-invalid]="bad(f)" /> }
                  @case ('date') { <input type="date" [formControlName]="f.key" [attr.name]="f.key" [attr.aria-invalid]="bad(f)" /> }
                  @default { <input [type]="f.type === 'url' ? 'url' : 'text'" [formControlName]="f.key" [attr.name]="f.key" [placeholder]="f.placeholder ?? ''" [attr.maxlength]="f.max" [attr.aria-invalid]="bad(f)" autocomplete="off" /> }
                }
                @if (bad(f)) { <small class="error">{{ message(f) }}</small> }
                @else if (f.hint) { <small class="hint">{{ f.hint }}</small> }
              </label>
            }
          }
        </div>

        <div class="form-row">
          <label>Ordre d’affichage<input type="number" min="0" max="99999" formControlName="displayOrder" /></label>
          <label class="toggle-label"><span class="lbl">Publication</span>
            <button type="button" [class]="published() ? 'toggle on' : 'toggle'" (click)="published.set(!published())" role="switch" [attr.aria-checked]="published()"><i></i></button>
            <span>{{ published() ? 'Publié' : 'Brouillon' }}</span>
          </label>
        </div>

        @if (error()) { <p class="error-message" role="alert">{{ error() }}</p> }
        <div class="modal-actions">
          <button type="button" (click)="closed.emit()">Annuler</button>
          <button class="button primary" type="submit" [disabled]="saving()">{{ saving() ? 'Enregistrement…' : 'Enregistrer' }}</button>
        </div>
      </form>
    </div>
  `,
})
export class ResourceFormComponent implements OnInit {
  readonly def = input.required<ResourceDef>();
  readonly item = input<AdminItem | null>(null);
  readonly nextOrder = input(1);
  readonly closed = output<void>();
  readonly saved = output<void>();

  private readonly store = inject(AdminStore);
  private readonly ui = inject(AdminUi);

  protected readonly form = new FormRecord<FormControl<string | number | boolean | null>>({});
  protected readonly published = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  private readonly serverErrors = signal<Record<string, string>>({});
  private readonly submitted = signal(false);

  ngOnInit(): void {
    const item = this.item();
    for (const f of this.def().fields) {
      this.form.addControl(f.key, new FormControl(this.initial(f, item), this.validators(f)));
    }
    this.form.addControl('displayOrder', new FormControl<number | null>(item ? item.displayOrder : this.nextOrder(), [Validators.min(0), Validators.max(99999)]));
    this.published.set(item ? item.published : true);
  }

  @HostListener('document:keydown.escape') protected onEsc(): void { this.closed.emit(); }

  private initial(f: FieldDef, item: AdminItem | null): string | number | boolean | null {
    const v = item?.[f.key];
    if (f.type === 'checkbox') return item ? !!v : !!f.default;
    if (f.type === 'tags') return Array.isArray(v) ? v.join(', ') : '';
    if (f.type === 'number' || f.type === 'range') return typeof v === 'number' ? v : item ? null : ((f.default as number | undefined) ?? null);
    return typeof v === 'string' ? v : '';
  }

  private validators(f: FieldDef): ValidatorFn[] {
    const v: ValidatorFn[] = [];
    if (f.required) v.push(Validators.required);
    if (f.type === 'number' || f.type === 'range') {
      if (f.min !== undefined) v.push(Validators.min(f.min));
      if (f.max !== undefined) v.push(Validators.max(f.max));
    } else if (f.max && f.type !== 'tags') v.push(Validators.maxLength(f.max));
    if (f.type === 'url') v.push(Validators.pattern(URL_RE));
    if (f.pattern) v.push(Validators.pattern(f.pattern));
    return v;
  }

  protected flip(key: string): void { const c = this.form.controls[key]; c.setValue(!c.value); }

  protected bad(f: FieldDef): boolean {
    const c = this.form.controls[f.key];
    return !!this.serverErrors()[f.key] || ((c.touched || this.submitted()) && c.invalid);
  }

  protected message(f: FieldDef): string {
    const server = this.serverErrors()[f.key];
    if (server) return server;
    const e = this.form.controls[f.key].errors ?? {};
    if (e['required']) return 'Champ requis.';
    if (e['maxlength']) return `${f.max} caractères maximum.`;
    if (e['min'] || e['max']) return `Valeur entre ${f.min ?? 0} et ${f.max}.`;
    if (e['pattern']) return f.type === 'url' ? 'URL http(s) invalide.' : (f.hint ?? 'Format invalide.');
    return 'Valeur invalide.';
  }

  protected submit(): void {
    this.submitted.set(true);
    this.error.set('');
    this.serverErrors.set({});
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;

    const raw = this.form.getRawValue();
    const order = Number(raw['displayOrder'] ?? 0) || 0;
    const payload = toPayload(this.def(), raw, this.published(), order);
    this.saving.set(true);
    this.store.save(this.def().key, this.item()?.id ?? null, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.ui.toast('ok', this.item() ? 'Modifications enregistrées.' : 'Élément créé.');
        this.saved.emit();
      },
      error: (err) => {
        const e = toApiError(err);
        this.saving.set(false);
        this.serverErrors.set(e.fieldErrors);
        const known = new Set(this.def().fields.map((f) => f.key));
        const stray = Object.entries(e.fieldErrors).filter(([k]) => !known.has(k.replace(/\[.*$/, ''))).map(([k, m]) => `${k} : ${m}`);
        this.error.set(stray.length ? stray.join(' · ') : Object.keys(e.fieldErrors).length ? '' : e.message);
      },
    });
  }
}
