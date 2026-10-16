import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PortfolioStore } from '../core/services/portfolio-store';
import { IconComponent } from '../shared/icon';
import { SectionIntroComponent } from '../shared/section-intro';
import { scrollToSection } from '../shared/scroll';
import { SITE } from '../site.config';

@Component({
  selector: 'app-about-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, SectionIntroComponent],
  template: `
    <section class="section about-section" id="about">
      <app-section-intro eyebrow="À propos">Curieux par nature.<br /><em>Ingénieur par choix.</em></app-section-intro>
      <div class="about-grid">
        <div class="about-statement reveal">
          <span class="giant-quote">“</span>
          <p>{{ site.quote.before }}<strong>{{ site.quote.strong }}</strong></p>
        </div>
        <div class="about-copy reveal">
          @for (para of paragraphs(); track $index) { <p>{{ para }}</p> }
          <button class="text-link" (click)="go('journey')">Découvrir mon parcours <app-icon name="arrow" /></button>
        </div>
        <div class="metric-card reveal">
          <strong>{{ years() }}+</strong><span>Années à apprendre,<br />construire et itérer.</span>
          <div class="metric-bars">@for (i of bars; track i) { <i></i> }</div>
        </div>
        <div class="principles-card reveal">
          <span>Mes principes</span>
          <ul>@for (pr of site.principles; track pr; let i = $index) { <li><b>{{ '0' + (i + 1) }}</b> {{ pr }}</li> }</ul>
        </div>
      </div>
    </section>
  `,
})
export class AboutSectionComponent {
  protected readonly site = SITE;
  protected readonly bars = [1, 2, 3, 4, 5, 6, 7];
  private readonly store = inject(PortfolioStore);

  protected readonly paragraphs = computed(() =>
    (this.store.profile()?.bio ?? '').split(/\n+/).map((s) => s.trim()).filter(Boolean),
  );

  /** Années depuis le début de la première expérience ou formation connue (3 par défaut). */
  protected readonly years = computed(() => {
    const starts = [
      ...this.store.experiences().map((e) => Number(e.startDate.slice(0, 4))),
      ...this.store.educations().map((e) => e.startYear),
    ].filter((y) => y > 1950);
    const n = starts.length ? new Date().getFullYear() - Math.min(...starts) : 3;
    return String(Math.max(n, 1)).padStart(2, '0');
  });

  protected go(id: string): void { scrollToSection(id); }
}
