import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PortfolioStore } from '../core/services/portfolio-store';
import { SectionIntroComponent } from '../shared/section-intro';
import { SITE } from '../site.config';

@Component({
  selector: 'app-skills-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionIntroComponent],
  template: `
    @if (groups().length) {
      <section class="section skills-section" id="skills">
        <app-section-intro eyebrow="Expertise"
          side="Des compétences construites par la pratique, nourries par la curiosité et consolidées projet après projet.">
          Un profil technique.<br /><em>Une vision globale.</em>
        </app-section-intro>
        <div class="skills-grid">
          @for (g of groups(); track g.category) {
            <article class="skill-card reveal">
              <div class="skill-head"><span>{{ g.index }}</span><small>{{ g.label }}</small></div>
              <h3>{{ g.title }}</h3>
              <div class="skill-list">
                @for (s of g.skills; track s.id) { <span [title]="s.levelPct + ' %'">{{ s.name }}</span> }
              </div>
            </article>
          }
        </div>
      </section>
    }
  `,
})
export class SkillsSectionComponent {
  private readonly store = inject(PortfolioStore);
  protected readonly groups = computed(() =>
    this.store.skillGroups().map((g, i) => ({
      ...g,
      index: String(i + 1).padStart(2, '0'),
      label: g.category.toUpperCase(),
      title: SITE.categoryTitles[g.category.toLowerCase()] ?? SITE.fallbackCategoryTitle,
    })),
  );
}
