import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'arrow' | 'briefcase' | 'check' | 'chevron' | 'close' | 'code' | 'download' | 'external' | 'eye'
  | 'github' | 'grid' | 'layers' | 'mail' | 'menu' | 'moon' | 'pen' | 'plus' | 'search' | 'send'
  | 'sun' | 'trash' | 'user' | 'linkedin' | 'link' | 'logout' | 'lock' | 'award' | 'book' | 'share';

type Shape =
  | { t: 'path'; d: string }
  | { t: 'rect'; x: number; y: number; w: number; h: number; rx?: number }
  | { t: 'circle'; cx: number; cy: number; r: number };

const p = (d: string): Shape => ({ t: 'path', d });
const rect = (x: number, y: number, w: number, h: number, rx = 0): Shape => ({ t: 'rect', x, y, w, h, rx });
const circle = (cx: number, cy: number, r: number): Shape => ({ t: 'circle', cx, cy, r });

const ICONS: Record<IconName, Shape[]> = {
  arrow: [p('M5 12h14M13 6l6 6-6 6')],
  briefcase: [rect(3, 7, 18, 13, 2), p('M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2')],
  check: [p('m5 12 4 4L19 6')],
  chevron: [p('m9 18 6-6-6-6')],
  close: [p('m6 6 12 12M18 6 6 18')],
  code: [p('m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14')],
  download: [p('M12 3v12M7 10l5 5 5-5M5 21h14')],
  external: [p('M15 4h5v5M10 14 20 4M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6')],
  eye: [p('M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z'), circle(12, 12, 2.5)],
  github: [p('M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7.4a5.8 5.8 0 0 0-1.5-4A5.4 5.4 0 0 0 19.1 0S17.9-.4 15 1.5a13.4 13.4 0 0 0-7 0C5.1-.4 3.9 0 3.9 0a5.4 5.4 0 0 0-.2 3.1 5.8 5.8 0 0 0-1.5 4c0 5.8 3.5 7 6.8 7.4A4.8 4.8 0 0 0 8 18v4M8 19c-3 .9-3-1.5-4-2')],
  grid: [rect(3, 3, 7, 7, 1), rect(14, 3, 7, 7, 1), rect(3, 14, 7, 7, 1), rect(14, 14, 7, 7, 1)],
  layers: [p('m12 2 9 5-9 5-9-5 9-5Z'), p('m3 12 9 5 9-5M3 17l9 5 9-5')],
  mail: [rect(3, 5, 18, 14, 2), p('m3 7 9 6 9-6')],
  menu: [p('M4 7h16M4 12h16M4 17h16')],
  moon: [p('M20.4 15.2A9 9 0 0 1 8.8 3.6 9 9 0 1 0 20.4 15.2Z')],
  pen: [p('m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z'), p('m14 7 3 3')],
  plus: [p('M12 5v14M5 12h14')],
  search: [circle(11, 11, 7), p('m20 20-4-4')],
  send: [p('m22 2-7 20-4-9-9-4 20-7Z'), p('M22 2 11 13')],
  sun: [circle(12, 12, 4), p('M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4')],
  trash: [p('M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6')],
  user: [circle(12, 8, 4), p('M4 21a8 8 0 0 1 16 0')],
  linkedin: [p('M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2zM4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z')],
  link: [p('M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7')],
  logout: [p('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9')],
  lock: [rect(4, 11, 16, 10, 2), p('M8 11V7a4 4 0 0 1 8 0v4')],
  award: [circle(12, 8, 6), p('m8.2 13.5-1.2 8.5 5-3 5 3-1.2-8.5')],
  book: [p('M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5')],
  share: [circle(18, 5, 3), circle(6, 12, 3), circle(18, 19, 3), p('m8.6 13.5 6.8 4M15.4 6.5l-6.8 4')],
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg aria-hidden="true" class="icon" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      @for (s of shapes(); track $index) {
        @switch (s.t) {
          @case ('path') { <svg:path [attr.d]="s.d" /> }
          @case ('rect') { <svg:rect [attr.x]="s.x" [attr.y]="s.y" [attr.width]="s.w" [attr.height]="s.h" [attr.rx]="s.rx" /> }
          @case ('circle') { <svg:circle [attr.cx]="s.cx" [attr.cy]="s.cy" [attr.r]="s.r" /> }
        }
      }
    </svg>
  `,
  styles: [':host{display:contents}'],
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(18);
  protected readonly shapes = computed(() => ICONS[this.name()] ?? []);
}
