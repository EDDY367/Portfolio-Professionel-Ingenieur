import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SITE } from '../site.config';

/**
 * Logo + nom en trois couleurs. À placer à l'intérieur d'un <a class="brand"> ou <button class="brand">.
 * Chaque mot reçoit une classe w0 / w1 / w2 (voir styles.css pour les couleurs).
 */
@Component({
  selector: 'app-brand',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="brand-mark"><img class="brand-logo-img" src="logo-mark.svg" alt="" /></span>
    <span class="brand-name">
      @for (word of words(); track $index) { <span [class]="'w' + ($index % 3)">{{ word }}</span> }
    </span>
  `,
  styles: [':host{display:contents}'],
})
export class BrandComponent {
  readonly name = input<string | null | undefined>();
  protected readonly words = computed(() => (this.name() || SITE.brandFallback).trim().split(/\s+/));
}
