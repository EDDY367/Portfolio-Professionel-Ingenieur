import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioStore } from '../core/services/portfolio-store';
import { IconComponent } from '../shared/icon';
import { SectionIntroComponent } from '../shared/section-intro';
import { safeUrl } from '../shared/format';
import { RevealDirective } from '../shared/reveal.directive';

const TONES = ['orange', 'blue', 'green'] as const;

@Component({
  selector: 'app-projects-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink, SectionIntroComponent, RevealDirective],
  template: `
    @if (items().length) {
      <section class="section projects-section" id="projects">
        <app-section-intro eyebrow="Projets sélectionnés"
          side="Une sélection de projets qui mêlent données, infrastructure, intelligence artificielle et produit.">
          Des idées. Des systèmes.<br /><em>Des résultats.</em>
        </app-section-intro>
        <div class="project-list">
          @for (p of items(); track p.id) {
            <article class="project-card reveal">
              @if (p.cover) {
                <div class="project-visual has-image">
                  <img [src]="p.cover" [alt]="'Aperçu du projet ' + p.title" loading="lazy" />
                  <span class="visual-number">{{ p.number }}</span>
                </div>
              } @else {
                <div [class]="'project-visual ' + p.tone">
                  <span class="visual-number">{{ p.number }}</span>
                  <div class="visual-orbit orbit-one"></div>
                  <div class="visual-orbit orbit-two"></div>
                  <div class="visual-core"><span>{{ p.mark }}</span><small>LAB</small></div>
                  <div class="visual-grid"></div>
                </div>
              }
              <div class="project-content">
                <div class="project-meta"><span>{{ p.type }}</span><span>{{ p.number }} / {{ total() }}</span></div>
                <a class="project-title-link" [routerLink]="['/projects', p.slug]"><h3>{{ p.title }}</h3></a>
                <p>{{ p.summary }}</p>
                <div class="project-bottom">
                  <div class="tags">@for (t of p.techStack; track t) { <span>{{ t }}</span> }</div>
                  <div class="project-links">
                    @if (p.github) {
                      <a [href]="p.github" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'GitHub de ' + p.title"><app-icon name="github" /></a>
                    }
                    @if (p.demo) {
                      <a [href]="p.demo" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'Démo de ' + p.title"><app-icon name="external" /></a>
                    }
                  </div>
                </div>
              </div>
            </article>
          }
        </div>
      </section>
    }
  `,
})
export class ProjectsSectionComponent {
  private readonly store = inject(PortfolioStore);
  protected readonly total = computed(() => String(this.store.projects().length).padStart(2, '0'));
  protected readonly items = computed(() =>
    this.store.projects().map((p, i) => ({
      ...p,
      number: String(i + 1).padStart(2, '0'),
      tone: TONES[i % TONES.length],
      type: p.featured ? 'Projet phare' : 'Projet',
      mark: p.title.slice(0, 2).toUpperCase(),
      cover: safeUrl(p.coverImageUrl),
      github: safeUrl(p.githubUrl),
      demo: safeUrl(p.demoUrl),
    })),
  );
}
