import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Project } from '../core/models/api.models';
import { PublicApiService } from '../core/services/public-api.service';
import { BrandComponent } from '../shared/brand';
import { IconComponent } from '../shared/icon';
import { safeUrl } from '../shared/format';

type State = 'loading' | 'ready' | 'notfound' | 'error';

/** Page /projects/:slug. Le paramètre d'URL arrive directement dans l'input `slug` (withComponentInputBinding). */
@Component({
  selector: 'app-project-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandComponent, IconComponent, RouterLink],
  template: `
    <div class="detail-page">
      <header class="detail-header">
        <a class="brand" routerLink="/"><app-brand /></a>
        @if (project(); as p) {
          <p class="eyebrow" style="margin-top: 45px"><span></span>Projet sélectionné</p>
          <h1>{{ p.title }}</h1>
          @if (p.summary) { <p class="hero-description">{{ p.summary }}</p> }
          <div class="detail-actions">
            <a class="button ghost" routerLink="/"><app-icon name="arrow" /> Retour au portfolio</a>
            @if (github(p); as url) { <a class="button primary" [href]="url" target="_blank" rel="noopener noreferrer"><app-icon name="github" /> Voir le code</a> }
            @if (demo(p); as url) { <a class="button ghost" [href]="url" target="_blank" rel="noopener noreferrer"><app-icon name="external" /> Voir la démo</a> }
          </div>
        }
      </header>

      <main class="detail-body">
        @switch (state()) {
          @case ('loading') { <div class="state-box" role="status"><span class="spinner"></span> Chargement du projet…</div> }
          @case ('notfound') {
            <div class="state-box" role="alert"><strong>Projet introuvable</strong>Il n’existe pas ou n’est plus publié.<br /><a routerLink="/">Retour à l’accueil</a></div>
          }
          @case ('error') {
            <div class="state-box" role="alert"><strong>Projet indisponible</strong>Le serveur ne répond pas. Vérifiez que l’API est démarrée.<br /><a routerLink="/">Retour à l’accueil</a></div>
          }
          @case ('ready') {
            @if (project(); as p) {
              @if (cover(p); as src) { <img class="detail-image" [src]="src" [alt]="'Aperçu de ' + p.title" /> }
              @if (p.techStack.length) { <div class="tags">@for (t of p.techStack; track t) { <span>{{ t }}</span> }</div> }
              @if (p.description) { <h2>À propos du projet</h2><p class="detail-text">{{ p.description }}</p> }
            }
          }
        }
      </main>
    </div>
  `,
})
export class ProjectDetailComponent {
  readonly slug = input.required<string>();

  private readonly api = inject(PublicApiService);
  private readonly title = inject(Title);

  protected readonly project = signal<Project | null>(null);
  protected readonly state = signal<State>('loading');

  constructor() {
    // Se relance si le slug change (navigation d'un projet à un autre).
    effect(() => {
      const slug = this.slug();
      untracked(() => {
        this.state.set('loading');
        this.project.set(null);
        this.api.project(slug).subscribe({
          next: (p) => { this.project.set(p); this.state.set('ready'); this.title.setTitle(`${p.title} · Portfolio`); },
          error: (e) => this.state.set(e?.status === 404 ? 'notfound' : 'error'),
        });
      });
    });
  }

  protected github(p: Project): string | null { return safeUrl(p.githubUrl); }
  protected demo(p: Project): string | null { return safeUrl(p.demoUrl); }
  protected cover(p: Project): string | null { return safeUrl(p.coverImageUrl); }
}
