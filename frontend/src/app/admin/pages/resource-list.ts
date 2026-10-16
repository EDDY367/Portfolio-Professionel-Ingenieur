import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { toApiError } from '../../core/services/api-error';
import { IconComponent } from '../../shared/icon';
import { safeUrl } from '../../shared/format';
import { AdminStore } from '../admin-store';
import { AdminUi } from '../admin-ui';
import { AdminItem, RESOURCE_BY_ROUTE, toPayload } from '../resources';
import { ResourceFormComponent } from '../ui/resource-form';

type StatusFilter = 'all' | 'published' | 'draft';

@Component({
  selector: 'app-resource-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, ResourceFormComponent],
  template: `
    @if (def(); as d) {
      <div class="admin-title">
        <div><p>CONTENU / {{ d.label.toUpperCase() }}</p><h1>{{ d.label }}</h1><span>Gérez le contenu affiché sur votre portfolio.</span></div>
        <button class="button primary" (click)="editing.set('new')"><app-icon name="plus" /> Ajouter</button>
      </div>

      <div class="admin-toolbar">
        <div class="table-search"><app-icon name="search" /><input [value]="ui.search()" (input)="ui.search.set($any($event.target).value)" [placeholder]="'Rechercher dans ' + d.label + '...'" /></div>
        <select class="status-select" [value]="status()" (change)="status.set($any($event.target).value)" aria-label="Filtrer par statut">
          <option value="all">Tous les statuts</option><option value="published">Publiés</option><option value="draft">Brouillons</option>
        </select>
        <span>{{ rows().length }} élément{{ rows().length > 1 ? 's' : '' }}</span>
      </div>

      <div class="admin-table-wrap">
        @if (loading()) {
          <div class="empty-state"><span class="spinner"></span><span>Chargement…</span></div>
        } @else if (loadError()) {
          <div class="empty-state"><strong>Chargement impossible</strong><span>{{ loadError() }}</span></div>
        } @else {
          <table>
            <thead><tr><th>TITRE</th><th>STATUT</th><th>ORDRE</th><th>ACTIONS</th></tr></thead>
            <tbody>
              @for (item of rows(); track item.id) {
                <tr>
                  <td>
                    <div [class]="'item-thumb type-' + d.key">
                      @if (thumb(item); as src) { <img [src]="src" alt="" /> } @else { {{ d.title(item).slice(0, 2).toUpperCase() }} }
                    </div>
                    <span class="item-title"><strong>{{ d.title(item) }}</strong><small>{{ d.detail(item) }}</small></span>
                  </td>
                  <td>
                    <button [class]="item.published ? 'status published' : 'status draft'" (click)="togglePublished(item)" [disabled]="busy() === item.id"
                            [attr.aria-label]="item.published ? 'Passer en brouillon' : 'Publier'">
                      <i></i>{{ item.published ? 'Publié' : 'Brouillon' }}
                    </button>
                  </td>
                  <td><span class="order-pill">{{ item.displayOrder }}</span></td>
                  <td><div class="row-actions">
                    <button (click)="editing.set(item)" aria-label="Modifier"><app-icon name="pen" [size]="16" /></button>
                    <button (click)="deleting.set(item)" aria-label="Supprimer"><app-icon name="trash" [size]="16" /></button>
                  </div></td>
                </tr>
              }
            </tbody>
          </table>
          @if (!rows().length) {
            <div class="empty-state"><app-icon name="search" [size]="28" /><strong>{{ all().length ? 'Aucun résultat' : 'Rien ici pour le moment' }}</strong>
              <span>{{ all().length ? 'Essayez une autre recherche.' : 'Cliquez sur « Ajouter » pour créer le premier élément.' }}</span></div>
          }
        }
      </div>

      @if (editing(); as e) {
        <app-resource-form [def]="d" [item]="e === 'new' ? null : e" [nextOrder]="all().length + 1" (closed)="editing.set(null)" (saved)="editing.set(null)" />
      }
      @if (deleting(); as del) {
        <div class="modal-backdrop" (mousedown)="deleting.set(null)">
          <div class="delete-modal" role="alertdialog" aria-modal="true" (mousedown)="$event.stopPropagation()">
            <div class="delete-icon"><app-icon name="trash" /></div>
            <h2>Supprimer cet élément ?</h2>
            <p>« {{ d.title(del) }} » sera définitivement supprimé. Cette action est irréversible.</p>
            <div>
              <button (click)="deleting.set(null)">Annuler</button>
              <button class="danger-button" (click)="confirmDelete(del)" [disabled]="busy() === del.id">Supprimer</button>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class ResourceListComponent {
  readonly type = input.required<string>();

  protected readonly ui = inject(AdminUi);
  private readonly store = inject(AdminStore);
  private readonly router = inject(Router);

  protected readonly def = computed(() => RESOURCE_BY_ROUTE[this.type()]);
  protected readonly status = signal<StatusFilter>('all');
  protected readonly loading = signal(true);
  protected readonly loadError = signal('');
  protected readonly editing = signal<AdminItem | 'new' | null>(null);
  protected readonly deleting = signal<AdminItem | null>(null);
  protected readonly busy = signal<number | null>(null);

  protected readonly all = computed(() => { const d = this.def(); return d ? this.store.data()[d.key] ?? [] : []; });
  protected readonly rows = computed(() => {
    const d = this.def();
    const q = this.ui.search().trim().toLowerCase();
    const st = this.status();
    return this.all().filter((i) =>
      (st === 'all' || (st === 'published') === i.published) &&
      (!q || `${d.title(i)} ${d.detail(i)}`.toLowerCase().includes(q)));
  });

  constructor() {
    effect(() => {
      const d = this.def();
      if (!d) { this.router.navigate(['/admin']); return; }
      untracked(() => {
        this.ui.search.set('');
        this.status.set('all');
        this.editing.set(null);
        this.deleting.set(null);
        this.loadError.set('');
        // Affiche tout de suite le cache, puis rafraîchit depuis l'API.
        this.loading.set(!this.store.data()[d.key]);
        this.store.refresh(d.key).subscribe({
          next: () => this.loading.set(false),
          error: (e) => { this.loadError.set(toApiError(e).message); this.loading.set(false); },
        });
      });
    });
  }

  protected thumb(item: AdminItem): string | null { return safeUrl(this.def().thumb?.(item)); }

  protected togglePublished(item: AdminItem): void {
    const d = this.def();
    this.busy.set(item.id);
    this.store.save(d.key, item.id, toPayload(d, item, !item.published, item.displayOrder)).subscribe({
      next: () => this.busy.set(null),
      error: (e) => { this.busy.set(null); this.ui.toast('err', toApiError(e).message); },
    });
  }

  protected confirmDelete(item: AdminItem): void {
    this.busy.set(item.id);
    this.store.remove(this.def().key, item.id).subscribe({
      next: () => { this.busy.set(null); this.deleting.set(null); this.ui.toast('ok', 'Élément supprimé.'); },
      error: (e) => { this.busy.set(null); this.deleting.set(null); this.ui.toast('err', toApiError(e).message); },
    });
  }
}
