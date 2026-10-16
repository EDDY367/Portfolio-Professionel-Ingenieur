import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioStore } from '../core/services/portfolio-store';
import { BrandComponent } from '../shared/brand';
import { safeUrl } from '../shared/format';
import { scrollToSection } from '../shared/scroll';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandComponent, RouterLink, RevealDirective],
  template: `
    <footer class="reveal">
      <button class="brand" (click)="top()" aria-label="Retour à l’accueil">
        <app-brand [name]="store.profile()?.fullName" />
      </button>
      <p>Conçu avec intention. Développé avec précision.</p>
      <div>
        @for (l of links(); track l.id) { <a [href]="l.url" target="_blank" rel="noopener noreferrer">{{ l.platform }}</a> }
        <a routerLink="/admin">Admin</a>
      </div>
      <span>© {{ year }}</span>
    </footer>
  `,
})
export class SiteFooterComponent {
  protected readonly store = inject(PortfolioStore);
  protected readonly year = new Date().getFullYear();
  protected readonly links = computed(() =>
    this.store.socialLinks().flatMap((l) => { const url = safeUrl(l.url); return url ? [{ ...l, url }] : []; }));
  protected top(): void { scrollToSection('home'); }
}
