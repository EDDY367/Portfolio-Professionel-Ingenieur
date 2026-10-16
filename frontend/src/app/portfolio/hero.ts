import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { PortfolioStore } from '../core/services/portfolio-store';
import { IconComponent } from '../shared/icon';
import { imageSrc, initials, safeUrl } from '../shared/format';
import { scrollToSection } from '../shared/scroll';
import { SITE } from '../site.config';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <section class="hero" id="home">
      <div class="hero-lines" aria-hidden="true"></div>
      <div class="hero-copy hero-copy-enter">
        <p class="availability"><span></span> {{ site.availability }}</p>
        <h1 [attr.aria-label]="site.heroTitle.line1 + ' ' + site.heroTitle.line2 + site.heroTitle.accent">
          <span class="hero-title-line" aria-hidden="true">@for (word of titleLine1(); track $index) {<span class="hero-title-word">@for (letter of word; track $index) {<span class="hero-title-letter" [style.--letter-delay]="letter.delay">{{ letter.char }}</span>}</span> }</span><br />
          <span class="hero-title-line" aria-hidden="true">@for (word of titleLine2(); track $index) {<span class="hero-title-word">@for (letter of word; track $index) {<span class="hero-title-letter" [style.--letter-delay]="letter.delay">{{ letter.char }}</span>}</span> }<span class="hero-title-accent">@for (letter of titleAccent(); track $index) {<span class="hero-title-letter" [style.--letter-delay]="letter.delay">{{ letter.char }}</span>}</span></span>
        </h1>
        <p class="hero-description">{{ description() }}</p>
        <div class="hero-actions">
          <button class="button primary" (click)="go('projects')">Explorer mes projets <app-icon name="arrow" /></button>
          @if (cv(); as url) {
            <a class="button ghost" [href]="url" target="_blank" rel="noopener noreferrer">
              <app-icon name="download" /> Télécharger mon CV
            </a>
          }
        </div>
      </div>
      <div class="hero-aside">
        <div class="portrait-card">
          @if (!photoFailed()) {
            <img class="portrait-photo" [src]="photo()" (error)="photoFailed.set(true)" [alt]="'Portrait de ' + (profile()?.fullName ?? '')" />
          } @else {
            <div class="portrait-placeholder">
              <div class="portrait-monogram">{{ monogram() }}</div>
              <p>Votre photo<br />professionnelle</p>
              <span>Format 4:5</span>
            </div>
          }
          <div class="portrait-caption"><span>Basé à</span><strong>{{ profile()?.location || '—' }}</strong></div>
        </div>
        <div class="hero-note"><span class="note-line"></span><p>{{ site.heroNote[0] }}<br />{{ site.heroNote[1] }}</p></div>
      </div>
      <div class="hero-footer">
        <span>Faire défiler</span>
        <div class="scroll-track"><i></i></div>
        <span class="hero-location">{{ site.coordinates }}</span>
      </div>
    </section>
  `,
})
export class HeroComponent implements OnDestroy {
  protected readonly site = SITE;
  private readonly fullTitleLength = SITE.heroTitle.line1.length + SITE.heroTitle.line2.length + SITE.heroTitle.accent.length;
  private readonly visibleLength = signal(0);
  protected readonly titleLine1 = computed(() => this.makeTitleWords(SITE.heroTitle.line1.slice(0, this.visibleLength())));
  protected readonly titleLine2 = computed(() => this.makeTitleWords(SITE.heroTitle.line2.slice(0, Math.max(0, this.visibleLength() - SITE.heroTitle.line1.length))));
  protected readonly titleAccent = computed(() => Array.from(SITE.heroTitle.accent.slice(0, Math.max(0, this.visibleLength() - SITE.heroTitle.line1.length - SITE.heroTitle.line2.length))).map((char) => ({ char, delay: '0s' })));
  private readonly store = inject(PortfolioStore);
  protected readonly profile = this.store.profile;
  protected readonly description = computed(() => this.profile()?.headline || this.profile()?.bio || '');
  protected readonly cv = computed(() => safeUrl(this.profile()?.cvUrl));
  /** Photo du profil, sinon la photo par défaut du site ; si elle ne charge pas, on affiche le monogramme. */
  protected readonly photo = computed(() => imageSrc(this.profile()?.photoUrl) ?? SITE.defaultPhoto);
  protected readonly photoFailed = signal(false);
  protected readonly monogram = computed(() => initials(this.profile()?.fullName));
  private deleting = false;
  private typingTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.visibleLength.set(this.fullTitleLength);
    } else {
      this.typingTimer = setTimeout(() => this.advanceTitle(), 350);
    }
  }

  ngOnDestroy(): void {
    if (this.typingTimer) clearTimeout(this.typingTimer);
  }

  private advanceTitle(): void {
    const visible = this.visibleLength();
    if (!this.deleting && visible >= this.fullTitleLength) {
      this.deleting = true;
      this.typingTimer = setTimeout(() => this.advanceTitle(), 5000);
      return;
    }
    if (this.deleting && visible === 0) {
      this.deleting = false;
      this.typingTimer = setTimeout(() => this.advanceTitle(), 450);
      return;
    }
    this.visibleLength.update((length) => length + (this.deleting ? -1 : 1));
    this.typingTimer = setTimeout(() => this.advanceTitle(), this.deleting ? 34 : 78);
  }

  private makeTitleWords(text: string): { char: string; delay: string }[][] {
    return text.trim().split(/\s+/).filter(Boolean).map((word) => Array.from(word).map((char) => ({ char, delay: '0s' })));
  }
  protected go(id: string): void { scrollToSection(id); }
}
