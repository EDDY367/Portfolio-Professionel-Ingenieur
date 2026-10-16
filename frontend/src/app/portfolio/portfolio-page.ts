import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PortfolioStore } from '../core/services/portfolio-store';
import { AboutSectionComponent } from './about-section';
import { ContactSectionComponent } from './contact-section';
import { HeroComponent } from './hero';
import { JourneySectionComponent } from './journey-section';
import { ProjectsSectionComponent } from './projects-section';
import { SiteFooterComponent } from './site-footer';
import { SiteHeaderComponent } from './site-header';
import { SkillsSectionComponent } from './skills-section';

@Component({
  selector: 'app-portfolio-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteHeaderComponent, HeroComponent, ProjectsSectionComponent, AboutSectionComponent,
    SkillsSectionComponent, JourneySectionComponent, ContactSectionComponent, SiteFooterComponent,
  ],
  template: `
    <div class="portfolio-shell">
      <app-site-header />
      <main>
        <app-hero />
        @if (store.loading()) {
          <div class="page-state" role="status"><span class="spinner"></span> Chargement du contenu…</div>
        } @else if (store.offline()) {
          <div class="page-state error" role="alert">
            <strong>Le serveur est injoignable.</strong>
            <span>Le contenu n’a pas pu être chargé. Vérifiez que l’API est démarrée.</span>
            <button class="button primary" (click)="store.load(true)">Réessayer</button>
          </div>
        } @else {
          <app-projects-section />
          <app-about-section />
          <app-skills-section />
          <app-journey-section />
        }
        <app-contact-section />
      </main>
      <app-site-footer />
    </div>
  `,
})
export class PortfolioPageComponent implements OnInit {
  protected readonly store = inject(PortfolioStore);
  ngOnInit(): void { this.store.load(); }
}
