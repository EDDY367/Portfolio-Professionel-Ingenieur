import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
        @for (l of links; track l.id) { <button (click)="go(l.id)">{{ l.label }}</button> }
        <a class="nav-admin" routerLink="/admin">Admin</a>
      </nav>
      <div class="header-actions">
        <button class="icon-button" (click)="theme.toggle()"
                [attr.aria-label]="theme.dark() ? 'Activer le mode clair' : 'Activer le mode sombre'">
          <app-icon [name]="theme.dark() ? 'sun' : 'moon'" />
        </button>
        <button class="contact-pill" (click)="go('contact')">Parlons-nous <span><app-icon name="arrow" [size]="15" /></span></button>
        <button class="menu-button" (click)="open.set(!open())" aria-label="Ouvrir le menu">
          <app-icon [name]="open() ? 'close' : 'menu'" />
        </button>
      </div>
    </header>
  `,
})
export class SiteHeaderComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly store = inject(PortfolioStore);
  protected readonly open = signal(false);
  protected readonly links = [
    { id: 'projects', label: 'Projets' }, { id: 'about', label: 'À propos' },
    { id: 'skills', label: 'Expertise' }, { id: 'journey', label: 'Parcours' },
  ];

  protected go(id: string): void { this.open.set(false); scrollToSection(id); }
}
