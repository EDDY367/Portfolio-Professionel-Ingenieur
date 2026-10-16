import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PortfolioStore } from '../core/services/portfolio-store';
import { IconComponent } from '../shared/icon';
import { SectionIntroComponent } from '../shared/section-intro';
import { monthYear, period, safeUrl } from '../shared/format';

@Component({
  selector: 'app-journey-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, SectionIntroComponent],
  template: `
    @if (experiences().length || educations().length || certifications().length) {
      <section class="section journey-section" id="journey">
        <app-section-intro eyebrow="Parcours">Construire, apprendre,<br /><em>recommencer.</em></app-section-intro>
        <div class="journey-layout" [class.journey-layout--timeline-only]="!educations().length && !certifications().length">
          <div class="timeline">
            @for (e of experiences(); track e.id; let i = $index) {
              <article class="timeline-item reveal">
                <div class="timeline-marker"><span>{{ pad(i + 1) }}</span></div>
                <div class="timeline-body">
                  <time>{{ e.period }}</time>
                  <h3>{{ e.roleTitle }}</h3>
                  <strong>{{ e.company }}@if (e.location) { · {{ e.location }} }</strong>
                  @if (e.description) { <p>{{ e.description }}</p> }
                </div>
              </article>
            }
          </div>
          @if (educations().length || certifications().length) {
          <aside class="education-panel reveal">
            @if (educations().length) {
              <p class="eyebrow"><span></span>Formation</p>
              @for (ed of educations(); track ed.id; let first = $first) {
                @if (first) { <div class="school-mark">{{ ed.school[0] }}</div> }
                <div class="education-item">
                  <span>{{ ed.startYear }}{{ ed.endYear ? ' — ' + ed.endYear : ' — Aujourd’hui' }}</span>
                  <h3>{{ ed.degree }}</h3>
                  @if (ed.description) { <p>{{ ed.description }}</p> }
                  <strong>{{ ed.school }}</strong>
                </div>
              }
            }
            @if (certifications().length) {
              <div class="certifications">
                <p class="eyebrow"><span></span>Certifications</p>
                @for (c of certifications(); track c.id) {
                  <div>
                    <app-icon name="check" />
                    <span>
                      <strong>
                        @if (c.url) { <a [href]="c.url" target="_blank" rel="noopener noreferrer">{{ c.title }}</a> } @else { {{ c.title }} }
                      </strong>
                      <small>{{ c.issuer }}{{ c.issued ? ' · ' + c.issued : '' }}</small>
                    </span>
                  </div>
                }
              </div>
            }
          </aside>
          }
        </div>
      </section>
    }
  `,
})
export class JourneySectionComponent {
  private readonly store = inject(PortfolioStore);
  protected readonly educations = this.store.educations;
  protected readonly experiences = computed(() =>
    this.store.experiences().map((e) => ({ ...e, period: period(e.startDate, e.endDate) })));
  protected readonly certifications = computed(() =>
    this.store.certifications().map((c) => ({ ...c, url: safeUrl(c.credentialUrl), issued: monthYear(c.issuedOn) })));
  protected pad(n: number): string { return String(n).padStart(2, '0'); }
}
