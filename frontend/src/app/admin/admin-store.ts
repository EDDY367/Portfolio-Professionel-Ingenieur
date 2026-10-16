import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, forkJoin, of, tap } from 'rxjs';
import { Profile } from '../core/models/api.models';
import { AdminApiService, ResourceKey } from '../core/services/admin-api.service';
import { AdminItem, RESOURCES } from './resources';

/** Cache des listes d'administration : alimente la barre latérale, le tableau de bord et les tableaux. */
@Injectable({ providedIn: 'root' })
export class AdminStore {
  private readonly api = inject(AdminApiService);

  readonly data = signal<Partial<Record<ResourceKey, AdminItem[]>>>({});
  readonly profile = signal<Profile | null>(null);
  readonly unread = signal(0);
  readonly loading = signal(false);
  readonly loadedOnce = signal(false);

  readonly publishedCount = computed(() =>
    Object.values(this.data()).reduce((n, list) => n + (list ?? []).filter((i) => i.published).length, 0));

  items(key: ResourceKey): AdminItem[] { return this.data()[key] ?? []; }
  count(key: ResourceKey): number { return this.items(key).length; }

  loadAll(): void {
    this.loading.set(true);
    const calls: Record<string, Observable<unknown>> = {
      profile: this.api.profile().pipe(catchError(() => of(null))),
      unread: this.api.unreadCount().pipe(catchError(() => of({ unread: 0 }))),
    };
    for (const r of RESOURCES) calls[r.key] = this.api.list<AdminItem>(r.key).pipe(catchError(() => of([] as AdminItem[])));
    forkJoin(calls).subscribe((res) => {
      const data: Partial<Record<ResourceKey, AdminItem[]>> = {};
      for (const r of RESOURCES) data[r.key] = res[r.key] as AdminItem[];
      this.data.set(data);
      this.profile.set(res['profile'] as Profile | null);
      this.unread.set((res['unread'] as { unread: number }).unread);
      this.loading.set(false);
      this.loadedOnce.set(true);
    });
  }

  refreshUnread(): void { this.api.unreadCount().subscribe((r) => this.unread.set(r.unread)); }

  /** Charge (ou recharge) une seule liste, utile à l'ouverture d'une page. */
  refresh(key: ResourceKey): Observable<AdminItem[]> {
    return this.api.list<AdminItem>(key).pipe(tap((list) => this.data.update((d) => ({ ...d, [key]: list }))));
  }

  save(key: ResourceKey, id: number | null, payload: object): Observable<AdminItem> {
    const call = id === null ? this.api.create<AdminItem>(key, payload) : this.api.update<AdminItem>(key, id, payload);
    return call.pipe(tap((saved) => this.data.update((d) => {
      const list = d[key] ?? [];
      const next = id === null ? [...list, saved] : list.map((i) => (i.id === saved.id ? saved : i));
      return { ...d, [key]: next.sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id) };
    })));
  }

  remove(key: ResourceKey, id: number): Observable<void> {
    return this.api.remove(key, id).pipe(tap(() => this.data.update((d) => ({ ...d, [key]: (d[key] ?? []).filter((i) => i.id !== id) }))));
  }

  reset(): void {
    this.data.set({}); this.profile.set(null); this.unread.set(0); this.loadedOnce.set(false);
  }
}
