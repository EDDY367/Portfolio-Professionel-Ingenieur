import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; kind: 'ok' | 'err'; text: string; }

/** État d'interface partagé de l'espace admin (recherche globale, menu mobile, notifications). */
@Injectable({ providedIn: 'root' })
export class AdminUi {
  readonly search = signal('');
  readonly sidebarOpen = signal(false);
  readonly toasts = signal<Toast[]>([]);
  private seq = 0;

  toast(kind: Toast['kind'], text: string): void {
    const id = ++this.seq;
    this.toasts.update((t) => [...t, { id, kind, text }]);
    setTimeout(() => this.toasts.update((t) => t.filter((x) => x.id !== id)), 4500);
  }
}
