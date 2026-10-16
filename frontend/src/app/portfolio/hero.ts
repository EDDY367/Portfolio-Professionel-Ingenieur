import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
      <div class="hero-copy">
        <p class="availability"><span></span> {{ site.availability }}</p>
        <h1 [attr.aria-label]="site.heroTitle.line1 + ' ' + site.heroTitle.line2 + site.heroTitle.accent">
          <span class="hero-title-line" aria-hidden="true">@for (word of titleLine1; track $index) {<span class="hero-title-word">@for (letter of word; track $index) {<span class="hero-title-letter" [style.--letter-delay]="letter.delay">{{ letter.char }}</span>}</span> }</span><br />
          <span class="hero-title-line" aria-hidden="true">@for (word of titleLine2; track $index) {<span class="hero-title-word">@for (letter of word; track $index) {<span class="hero-title-letter" [style.--letter-delay]="letter.delay">{{ letter.char }}</span>}</span> }<span class="hero-title-accent">@for (letter of titleAccent; track $index) {<span class="hero-title-letter" [style.--letter-delay]="letter.delay">{{ letter.char }}</span>}</span></span>
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
export class HeroComponent {
  protected readonly site = SITE;
  protected readonly titleLine1 = this.makeTitleWords(SITE.heroTitle.line1, 0);
  protected readonly titleLine2 = this.makeTitleWords(SITE.heroTitle.line2, SITE.heroTitle.line1.length);
  protected readonly titleAccent = Array.from(SITE.heroTitle.accent).map((char, index) => ({ char, delay: `${(SITE.heroTitle.line1.length + SITE.heroTitle.line2.length + index) * 0.025}s` }));
  private readonly store = inject(PortfolioStore);
  protected readonly profile = this.store.profile;
  protected readonly description = computed(() => this.profile()?.headline || this.profile()?.bio || '');
  protected readonly cv = computed(() => safeUrl(this.profile()?.cvUrl));
  /** Photo du profil, sinon la photo par défaut du site ; si elle ne charge pas, on affiche le monogramme. */
  protected readonly photo = computed(() => imageSrc(this.profile()?.photoUrl) ?? SITE.defaultPhoto);
  protected readonly photoFailed = signal(false);
  protected readonly monogram = computed(() => initials(this.profile()?.fullName));
  private makeTitleWords(text: string, offset: number): { char: string; delay: string }[][] {
    let index = offset;
    return text.trim().split(/\s+/).map((word) => Array.from(word).map((char) => ({ char, delay: `${index++ * 0.025}s` })));
  }
  protected go(id: string): void { scrollToSection(id); }
}
