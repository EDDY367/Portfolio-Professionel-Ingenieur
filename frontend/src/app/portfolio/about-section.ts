import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, signal } from '@angular/core';
import { PortfolioStore } from '../core/services/portfolio-store';
import { IconComponent } from '../shared/icon';
import { SectionIntroComponent } from '../shared/section-intro';
import { scrollToSection } from '../shared/scroll';
import { SITE } from '../site.config';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-about-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, SectionIntroComponent, RevealDirective],
  template: `
    <section class="section about-section" id="about">
      <app-section-intro eyebrow="À propos">Curieux par nature.<br /><em>Ingénieur par choix.</em></app-section-intro>
      <div class="about-grid">
        <div class="about-statement reveal reveal-bounce">
          <span class="giant-quote">“</span>
          <p>{{ site.quote.before }}<strong>{{ site.quote.strong }}</strong></p>
        </div>
        <div class="about-copy reveal reveal-bounce">
          @for (para of paragraphs(); track $index) { <p>{{ para }}</p> }
          <button class="text-link" (click)="go('journey')">Découvrir mon parcours <app-icon name="arrow" /></button>
        </div>
        <div class="metric-card reveal reveal-bounce">
          <strong>{{ countedYears() }}+</strong><span>Années à apprendre,<br />construire et itérer.</span>
          <div class="metric-bars">@for (i of bars; track i) { <i></i> }</div>
        </div>
        <div class="principles-card reveal reveal-bounce">
          <span>Mes principes</span>
          <ul>@for (pr of site.principles; track pr; let i = $index) { <li><b>{{ '0' + (i + 1) }}</b> {{ pr }}</li> }</ul>
        </div>
      </div>
    </section>
  `,
})
export class AboutSectionComponent implements AfterViewInit, OnDestroy {
  protected readonly site = SITE;
  protected readonly bars = [1, 2, 3, 4, 5, 6, 7];
  private readonly store = inject(PortfolioStore);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly countProgress = signal(0);
  private observer?: IntersectionObserver;
  private frame?: number;
  private countStarted = false;
  protected readonly countedYears = computed(() => String(Math.round(Number(this.years()) * this.countProgress())).padStart(2, '0'));

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

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.countProgress.set(1);
      return;
    }
    const metric = this.host.nativeElement.querySelector('.metric-card');
    if (!metric || typeof IntersectionObserver === 'undefined') {
      this.animateCount();
      return;
    }
    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.observer?.disconnect();
      this.animateCount();
    }, { threshold: 0.2 });
    this.observer.observe(metric);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
  }

  private animateCount(): void {
    if (this.countStarted) return;
    this.countStarted = true;
    const startedAt = performance.now();
    const duration = 1900;
    const step = (now: number): void => {
      const progress = Math.min((now - startedAt) / duration, 1);
      this.countProgress.set(1 - Math.pow(1 - progress, 3));
      if (progress < 1) this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  protected go(id: string): void { scrollToSection(id); }
}
