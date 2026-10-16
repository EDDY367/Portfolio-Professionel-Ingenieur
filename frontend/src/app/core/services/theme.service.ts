import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly dark = signal(localStorage.getItem('theme') !== 'light');

  constructor() {
    effect(() => {
      const mode = this.dark() ? 'dark' : 'light';
      document.documentElement.dataset['theme'] = mode;
      localStorage.setItem('theme', mode);
    });
  }

  toggle(): void { this.dark.update((v) => !v); }
}
