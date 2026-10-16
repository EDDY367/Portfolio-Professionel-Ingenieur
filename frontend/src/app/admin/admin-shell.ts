import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, inject, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { IconComponent } from '../shared/icon';
import { initials } from '../shared/format';
import { AdminStore } from './admin-store';
import { AdminUi } from './admin-ui';
import { RESOURCES } from './resources';

@Component({
  selector: 'app-admin-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="admin-shell">
      <aside [class]="ui.sidebarOpen() ? 'admin-sidebar open' : 'admin-sidebar'">
        <div class="admin-logo">
          <img class="admin-logo-img" src="logo-mark.svg" alt="" />
          <div><strong>Portfolio</strong><small>Content studio</small></div>
          <button class="sidebar-close" (click)="ui.sidebarOpen.set(false)" aria-label="Fermer"><app-icon name="close" /></button>
        </div>
        <nav aria-label="Sections d’administration" (click)="ui.sidebarOpen.set(false)">
          <p>ESPACE DE TRAVAIL</p>
          <button routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><app-icon name="grid" /> Vue d’ensemble</button>
          <p>CONTENU</p>
          <button routerLink="/admin/profile" routerLinkActive="active"><app-icon name="user" /> Profil</button>
          @for (r of resources; track r.key) {
            <button [routerLink]="'/admin/' + r.route" routerLinkActive="active"><app-icon [name]="r.icon" /> {{ r.label }}<span>{{ store.count(r.key) }}</span></button>
          }
          <button routerLink="/admin/messages" routerLinkActive="active"><app-icon name="mail" /> Messages
            @if (store.unread() > 0) { <span class="badge">{{ store.unread() }}</span> }</button>
        </nav>
        <div class="admin-profile">
          <div>{{ avatar() }}</div>
          <span><strong>{{ displayName() }}</strong><small>Administrateur</small></span>
          <button class="logout" (click)="logout()" aria-label="Se déconnecter" title="Se déconnecter"><app-icon name="logout" [size]="16" /></button>
        </div>
      </aside>

      <main class="admin-main">
        <header class="admin-header">
          <button class="admin-menu" (click)="ui.sidebarOpen.set(true)" aria-label="Menu"><app-icon name="menu" /></button>
          <div class="admin-search"><app-icon name="search" />
            <input #search [value]="ui.search()" (input)="ui.search.set($any($event.target).value)" placeholder="Rechercher dans la liste…" /><kbd>Ctrl K</kbd></div>
          <div class="admin-header-actions">
            <button class="icon-button" (click)="theme.toggle()" aria-label="Changer le thème"><app-icon [name]="theme.dark() ? 'sun' : 'moon'" /></button>
            <a class="preview-button" routerLink="/"><app-icon name="eye" /> Voir le portfolio</a>
          </div>
        </header>
        <router-outlet />
      </main>

      <div class="toasts" aria-live="polite">
        @for (t of ui.toasts(); track t.id) { <div [class]="'toast ' + t.kind">{{ t.text }}</div> }
      </div>
    </div>
  `,
})
export class AdminShellComponent implements OnInit {
  protected readonly ui = inject(AdminUi);
  protected readonly store = inject(AdminStore);
  protected readonly theme = inject(ThemeService);
  private readonly auth = inject(AuthService);
  protected readonly resources = RESOURCES;
  private readonly searchBox = viewChild<ElementRef<HTMLInputElement>>('search');

  ngOnInit(): void { this.store.loadAll(); }

  protected displayName(): string { return this.store.profile()?.fullName?.split(/\s+/).slice(0, 2).join(' ') ?? this.auth.email() ?? 'Admin'; }
  protected avatar(): string { return initials(this.store.profile()?.fullName ?? this.auth.email()).slice(0, 2); }

  protected logout(): void { this.store.reset(); this.auth.logout(); }

  @HostListener('document:keydown', ['$event'])
  protected onKey(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); this.searchBox()?.nativeElement.focus(); }
  }
}
