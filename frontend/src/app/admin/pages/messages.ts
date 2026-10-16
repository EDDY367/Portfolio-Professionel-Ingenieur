import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Message, PageResponse } from '../../core/models/api.models';
import { AdminApiService } from '../../core/services/admin-api.service';
import { toApiError } from '../../core/services/api-error';
import { IconComponent } from '../../shared/icon';
import { relativeTime } from '../../shared/format';
import { AdminStore } from '../admin-store';
import { AdminUi } from '../admin-ui';

@Component({
  selector: 'app-messages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="admin-title">
      <div><p>CONTENU / MESSAGES</p><h1>Messages</h1><span>Messages envoyés depuis le formulaire de contact.</span></div>
    </div>
    <div class="admin-toolbar">
      <div class="table-search"><app-icon name="search" /><input [value]="ui.search()" (input)="ui.search.set($any($event.target).value)" placeholder="Rechercher dans Messages..." /></div>
      <span>{{ page()?.totalElements ?? 0 }} message{{ (page()?.totalElements ?? 0) > 1 ? 's' : '' }} · {{ store.unread() }} non lu{{ store.unread() > 1 ? 's' : '' }}</span>
    </div>
    <div class="admin-table-wrap">
      @if (loading()) {
        <div class="empty-state"><span class="spinner"></span><span>Chargement…</span></div>
      } @else if (loadError()) {
        <div class="empty-state"><strong>Chargement impossible</strong><span>{{ loadError() }}</span></div>
      } @else {
        <table>
          <thead><tr><th>EXPÉDITEUR</th><th>STATUT</th><th>REÇU</th><th>ACTIONS</th></tr></thead>
          <tbody>
            @for (m of rows(); track m.id) {
              <tr [class.unread]="!m.read">
                <td class="clickable" (click)="open(m)">
                  <div class="item-thumb type-message">{{ m.senderName.slice(0, 2).toUpperCase() }}</div>
                  <span class="item-title"><strong>{{ m.senderName }}</strong><small>{{ m.subject || preview(m.body) }}</small></span>
                </td>
                <td>
                  <button [class]="m.read ? 'status draft' : 'status published'" (click)="toggleRead(m)" [attr.aria-label]="m.read ? 'Marquer non lu' : 'Marquer lu'"><i></i>{{ m.read ? 'Lu' : 'Non lu' }}</button>
                </td>
                <td>{{ when(m.createdAt) }}</td>
                <td><div class="row-actions">
                  <button (click)="open(m)" aria-label="Lire"><app-icon name="eye" [size]="16" /></button>
                  <button (click)="deleting.set(m)" aria-label="Supprimer"><app-icon name="trash" [size]="16" /></button>
                </div></td>
              </tr>
            }
          </tbody>
        </table>
        @if (!rows().length) {
          <div class="empty-state"><app-icon name="mail" [size]="28" /><strong>Aucun message</strong><span>Les messages du formulaire de contact apparaîtront ici.</span></div>
        }
      }
    </div>
    @if ((page()?.totalPages ?? 0) > 1) {
      <div class="pager">
        <button (click)="go(page()!.page - 1)" [disabled]="page()!.page === 0">Précédent</button>
        <span>Page {{ page()!.page + 1 }} / {{ page()!.totalPages }}</span>
        <button (click)="go(page()!.page + 1)" [disabled]="page()!.page + 1 >= page()!.totalPages">Suivant</button>
      </div>
    }

    @if (reading(); as m) {
      <div class="modal-backdrop" (mousedown)="reading.set(null)">
        <article class="admin-modal message-modal" role="dialog" aria-modal="true" (mousedown)="$event.stopPropagation()">
          <div class="modal-head">
            <div><span>{{ when(m.createdAt).toUpperCase() }}</span><h2>{{ m.subject || 'Nouveau message' }}</h2></div>
            <button type="button" (click)="reading.set(null)" aria-label="Fermer"><app-icon name="close" /></button>
          </div>
          <p class="message-from"><strong>{{ m.senderName }}</strong> · <a [href]="'mailto:' + m.senderEmail">{{ m.senderEmail }}</a></p>
          <p class="message-body">{{ m.body }}</p>
          <div class="modal-actions">
            <button type="button" (click)="reading.set(null)">Fermer</button>
            <a class="button primary" [href]="'mailto:' + m.senderEmail + '?subject=' + reSubject(m)"><app-icon name="mail" /> Répondre</a>
          </div>
        </article>
      </div>
    }
    @if (deleting(); as m) {
      <div class="modal-backdrop" (mousedown)="deleting.set(null)">
        <div class="delete-modal" role="alertdialog" aria-modal="true" (mousedown)="$event.stopPropagation()">
          <div class="delete-icon"><app-icon name="trash" /></div>
          <h2>Supprimer ce message ?</h2>
          <p>Le message de « {{ m.senderName }} » sera définitivement supprimé.</p>
          <div><button (click)="deleting.set(null)">Annuler</button><button class="danger-button" (click)="confirmDelete(m)">Supprimer</button></div>
        </div>
      </div>
    }
  `,
})
export class MessagesComponent implements OnInit {
  protected readonly ui = inject(AdminUi);
  protected readonly store = inject(AdminStore);
  private readonly api = inject(AdminApiService);

  protected readonly page = signal<PageResponse<Message> | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadError = signal('');
  protected readonly reading = signal<Message | null>(null);
  protected readonly deleting = signal<Message | null>(null);

  protected readonly rows = computed(() => {
    const q = this.ui.search().trim().toLowerCase();
    const items = this.page()?.items ?? [];
    return q ? items.filter((m) => `${m.senderName} ${m.senderEmail} ${m.subject ?? ''} ${m.body}`.toLowerCase().includes(q)) : items;
  });

  ngOnInit(): void { this.ui.search.set(''); this.go(0); }

  protected go(n: number): void {
    this.loading.set(true);
    this.api.messages(n).subscribe({
      next: (p) => { this.page.set(p); this.loading.set(false); this.loadError.set(''); },
      error: (e) => { this.loadError.set(toApiError(e).message); this.loading.set(false); },
    });
  }

  protected when(iso: string): string { return relativeTime(iso); }
  protected preview(body: string): string { return body.length > 70 ? body.slice(0, 70) + '…' : body; }
  protected reSubject(m: Message): string { return encodeURIComponent('Re: ' + (m.subject || 'Votre message')); }

  protected open(m: Message): void {
    this.reading.set(m);
    if (!m.read) this.setRead(m, true);
  }

  protected toggleRead(m: Message): void { this.setRead(m, !m.read); }

  private setRead(m: Message, read: boolean): void {
    this.api.markRead(m.id, read).subscribe({
      next: (updated) => {
        this.page.update((p) => p && { ...p, items: p.items.map((x) => (x.id === updated.id ? updated : x)) });
        if (this.reading()?.id === updated.id) this.reading.set(updated);
        this.store.refreshUnread();
      },
      error: (e) => this.ui.toast('err', toApiError(e).message),
    });
  }

  protected confirmDelete(m: Message): void {
    this.api.deleteMessage(m.id).subscribe({
      next: () => {
        this.deleting.set(null);
        this.ui.toast('ok', 'Message supprimé.');
        this.store.refreshUnread();
        const p = this.page();
        // Si on vient de vider la page courante, on recule d'une page.
        this.go(p && p.items.length === 1 && p.page > 0 ? p.page - 1 : (p?.page ?? 0));
      },
      error: (e) => { this.deleting.set(null); this.ui.toast('err', toApiError(e).message); },
    });
  }
}
