import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/icon';
import { titleCase } from '../../shared/format';
import { AdminStore } from '../admin-store';
import { RESOURCE_BY_ROUTE } from '../resources';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink],
  template: `
    <div class="dashboard">
      <div class="admin-title">
        <div><p>ESPACE DE TRAVAIL</p><h1>Bonjour, {{ greetingName() }}.</h1><span>Voici l’état de votre portfolio aujourd’hui.</span></div>
        <a class="button primary" routerLink="/admin/projects"><app-icon name="plus" /> Nouveau projet</a>
      </div>

      <div class="dashboard-stats">
        <div><span>Contenus publiés</span><strong>{{ store.publishedCount() }}</strong><small><i></i> Visibles sur le site</small></div>
        <div><span>Projets</span><strong>{{ store.count('projects') }}</strong><small>{{ published('projects') }} publié(s)</small></div>
        <div><span>Messages non lus</span><strong>{{ store.unread() }}</strong><small>Formulaire de contact</small></div>
        <div><span>Compétences</span><strong>{{ store.count('skills') }}</strong><small>{{ categories() }} catégorie(s)</small></div>
      </div>

      <div class="dashboard-grid">
        <section>
          <div class="panel-head"><div><p>APERÇU</p><h2>Contenus récents</h2></div><a class="panel-link" routerLink="/admin/projects">Tout voir <app-icon name="arrow" [size]="14" /></a></div>
          @for (a of activity(); track a.route) {
            <a class="activity-row" [routerLink]="'/admin/' + a.route">
              <div [class]="'item-thumb type-' + a.key">{{ a.label.slice(0, 2) }}</div>
              <span><strong>{{ a.title }}</strong><small>{{ a.label }}</small></span>
              <app-icon name="chevron" />
            </a>
          } @empty {
            <p class="muted-note">Aucun contenu pour l’instant. Commencez par ajouter un projet.</p>
          }
        </section>
        <aside>
          <p>COMPLÉTUDE DU PROFIL</p>
          <div class="completion"><strong>{{ completion() }}%</strong><span>{{ completion() === 100 ? 'Votre portfolio est prêt.' : 'Votre portfolio est presque prêt.' }}</span><div><i [style.width.%]="completion()"></i></div></div>
          <ul>
            @for (c of checklist(); track c.label) {
              <li [class.done]="c.done">@if (c.done) { <app-icon name="check" [size]="14" /> } @else { <span></span> }
                <a [routerLink]="c.link">{{ c.label }}</a></li>
            }
          </ul>
        </aside>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  protected readonly store = inject(AdminStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly greetingName = computed(() => { const n = this.store.profile()?.fullName; return n ? titleCase(n) : (this.auth.email()?.split('@')[0] ?? 'Admin'); });
  protected published(key: 'projects'): number { return this.store.items(key).filter((i) => i.published).length; }
  protected readonly categories = computed(() => new Set(this.store.items('skills').map((s) => s['category'])).size);

  protected readonly activity = computed(() =>
    ['projects', 'skills', 'certifications'].flatMap((route) => {
      const def = RESOURCE_BY_ROUTE[route];
      const first = this.store.items(def.key)[0];
      return first ? [{ route, key: def.key, label: def.singular, title: def.title(first) }] : [];
    }));

  private readonly profileFields = ['fullName', 'headline', 'bio', 'email', 'phone', 'location', 'photoUrl', 'cvUrl'] as const;
  protected readonly completion = computed(() => {
    const p = this.store.profile();
    if (!p) return 0;
    const filled = this.profileFields.filter((k) => !!p[k]).length;
    return Math.round((filled / this.profileFields.length) * 100);
  });

  protected readonly checklist = computed(() => {
    const p = this.store.profile();
    return [
      { label: 'Profil renseigné', done: !!p, link: '/admin/profile' },
      { label: 'Projets publiés', done: this.published('projects') > 0, link: '/admin/projects' },
      { label: 'Ajouter une photo', done: !!p?.photoUrl, link: '/admin/profile' },
      { label: 'Ajouter le CV définitif', done: !!p?.cvUrl, link: '/admin/profile' },
    ];
  });
}
