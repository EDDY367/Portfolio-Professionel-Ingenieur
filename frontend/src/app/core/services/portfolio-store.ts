import { Injectable, computed, inject, signal } from '@angular/core';
import { OperatorFunction, catchError, forkJoin, of } from 'rxjs';
import {
  Certification, Education, Experience, Profile, Project, Skill, SocialLink,
} from '../models/api.models';
import { PublicApiService } from './public-api.service';

export interface SkillGroup { category: string; skills: Skill[]; }

/** État du site public : charge tout en parallèle, une requête en échec ne bloque pas les autres. */
@Injectable({ providedIn: 'root' })
export class PortfolioStore {
  private readonly api = inject(PublicApiService);

  readonly profile = signal<Profile | null>(null);
  readonly projects = signal<Project[]>([]);
  readonly skills = signal<Skill[]>([]);
  readonly experiences = signal<Experience[]>([]);
  readonly educations = signal<Education[]>([]);
  readonly certifications = signal<Certification[]>([]);
  readonly socialLinks = signal<SocialLink[]>([]);

  readonly loading = signal(true);
  /** true uniquement si le serveur est injoignable (toutes les requêtes ont échoué). */
  readonly offline = signal(false);
  private loaded = false;

  /** Compétences regroupées par catégorie, dans l'ordre d'apparition (le backend trie déjà par displayOrder). */
  readonly skillGroups = computed<SkillGroup[]>(() => {
    const map = new Map<string, Skill[]>();
    for (const s of this.skills()) {
      const list = map.get(s.category) ?? [];
      list.push(s);
      map.set(s.category, list);
    }
    return [...map].map(([category, skills]) => ({ category, skills }));
  });

  load(force = false): void {
    if (this.loaded && !force) return;
    this.loaded = true;
    this.loading.set(true);
    this.offline.set(false);
    let failures = 0;
    const safe = <T>(fallback: T): OperatorFunction<T, T> => catchError(() => { failures++; return of(fallback); });

    forkJoin({
      profile: this.api.profile().pipe(safe<Profile | null>(null)),
      projects: this.api.projects().pipe(safe<Project[]>([])),
      skills: this.api.skills().pipe(safe<Skill[]>([])),
      experiences: this.api.experiences().pipe(safe<Experience[]>([])),
      educations: this.api.educations().pipe(safe<Education[]>([])),
      certifications: this.api.certifications().pipe(safe<Certification[]>([])),
      socialLinks: this.api.socialLinks().pipe(safe<SocialLink[]>([])),
    }).subscribe((r) => {
      this.profile.set(r.profile);
      this.projects.set(r.projects);
      this.skills.set(r.skills);
      this.experiences.set(r.experiences);
      this.educations.set(r.educations);
      this.certifications.set(r.certifications);
      this.socialLinks.set(r.socialLinks);
      this.offline.set(failures >= 7);
      if (failures >= 7) this.loaded = false; // permet de réessayer
      this.loading.set(false);
    });
  }
}
