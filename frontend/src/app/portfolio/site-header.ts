import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioStore } from '../core/services/portfolio-store';
import { ThemeService } from '../core/services/theme.service';
import { BrandComponent } from '../shared/brand';
import { IconComponent } from '../shared/icon';
import { scrollToSection } from '../shared/scroll';

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandComponent, IconComponent, RouterLink],
  template: `
    <header class="site-header">
      <button class="brand" (click)="go('home')" aria-label="Retour à l’accueil">
        <app-brand [name]="store.profile()?.fullName" />
      </button>
      <nav [class]="open() ? 'nav-links open' : 'nav-links'" aria-label="Navigation principale">
        @for (l of links; track l.id) { <button [class.active]="active() === l.id" [attr.aria-current]="active() === l.id ? 'location' : null" (click)="go(l.id)">{{ l.label }}</button> }
        <a class="nav-admin" routerLink="/admin">Admin</a>
      </nav>
      <div class="header-actions">
        <button class="icon-button" (click)="theme.toggle()"
                [attr.aria-label]="theme.dark() ? 'Activer le mode clair' : 'Activer le mode sombre'">
          <app-icon [name]="theme.dark() ? 'sun' : 'moon'" />
        </button>
        <button class="contact-pill" (click)="go('contact')">Parlons-nous <span><app-icon name="arrow" [size]="15" /></span></button>
        <button class="menu-button" (click)="open.set(!open())" [attr.aria-label]="open() ? 'Fermer le menu' : 'Ouvrir le menu'" [attr.aria-expanded]="open()">
          <app-icon [name]="open() ? 'close' : 'menu'" />
        </button>
      </div>
    </header>
  `,
})
export class SiteHeaderComponent implements AfterViewInit, OnDestroy {
  protected readonly theme = inject(ThemeService);
  protected readonly store = inject(PortfolioStore);
  protected readonly open = signal(false);
  protected readonly active = signal('projects');
  private observer?: IntersectionObserver;
  private sectionsObserver?: MutationObserver;
  protected readonly links = [
    { id: 'projects', label: 'Projets' }, { id: 'about', label: 'À propos' },
    { id: 'skills', label: 'Expertise' }, { id: 'journey', label: 'Parcours' },
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) this.active.set((current.target as HTMLElement).id);
    }, { threshold: [0.15, 0.35, 0.6], rootMargin: '-24% 0px -58% 0px' });
    const observeSections = (): boolean => {
      let found = 0;
      this.links.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) { this.observer?.observe(section); found++; }
      });
      return found === this.links.length;
    };
    if (!observeSections()) {
      this.sectionsObserver = new MutationObserver(() => {
        if (observeSections()) this.sectionsObserver?.disconnect();
      });
      this.sectionsObserver.observe(document.querySelector('main') ?? document.body, { childList: true, subtree: true });
    }
  }

  ngOnDestroy(): void { this.observer?.disconnect(); this.sectionsObserver?.disconnect(); }

  protected go(id: string): void { this.open.set(false); this.active.set(id); scrollToSection(id); }
}
