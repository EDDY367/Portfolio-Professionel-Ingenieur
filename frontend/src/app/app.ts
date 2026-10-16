import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  // Instancié dès le démarrage pour appliquer le thème (clair/sombre) sur toutes les pages.
  private readonly theme = inject(ThemeService);
}
