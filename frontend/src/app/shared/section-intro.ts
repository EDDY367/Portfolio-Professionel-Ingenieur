import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** En-tête de section. Le titre est projeté (<ng-content>) pour pouvoir y mettre <em> et <br>. */
@Component({
  selector: 'app-section-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-intro reveal">
      <div>
        <p class="eyebrow"><span></span>{{ eyebrow() }}</p>
        <h2><ng-content /></h2>
      </div>
      @if (side()) { <p class="section-side">{{ side() }}</p> }
    </div>
  `,
})
export class SectionIntroComponent {
  readonly eyebrow = input.required<string>();
  readonly side = input<string>();
}
