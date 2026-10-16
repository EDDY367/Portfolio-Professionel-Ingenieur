import { ResourceKey } from '../core/services/admin-api.service';
import { IconName } from '../shared/icon';

export type FieldType = 'text' | 'textarea' | 'url' | 'number' | 'range' | 'date' | 'tags' | 'checkbox';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  max?: number;       // longueur max (texte) ou valeur max (nombre)
  min?: number;
  pattern?: string;
  placeholder?: string;
  hint?: string;
  half?: boolean;     // occupe une demi-ligne dans la modale
  default?: string | number | boolean;
}

export type AdminItem = { id: number; published: boolean; displayOrder: number } & Record<string, unknown>;

export interface ResourceDef {
  key: ResourceKey;
  route: string;
  label: string;      // pluriel (menu, titre)
  singular: string;
  icon: IconName;
  fields: FieldDef[];
  title: (i: AdminItem) => string;
  detail: (i: AdminItem) => string;
  thumb?: (i: AdminItem) => string | null;
}

const URL_RE = '^https?://\\S+$';
const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));

export const RESOURCES: ResourceDef[] = [
  {
    key: 'projects', route: 'projects', label: 'Projets', singular: 'Projet', icon: 'layers',
    title: (i) => str(i['title']),
    detail: (i) => (Array.isArray(i['techStack']) ? (i['techStack'] as string[]).join(', ') : '') || str(i['summary']),
    thumb: (i) => str(i['coverImageUrl']) || null,
    fields: [
      { key: 'title', label: 'Titre', type: 'text', required: true, max: 200 },
      { key: 'slug', label: 'Slug', type: 'text', required: true, max: 120, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', placeholder: 'mon-projet', hint: 'Minuscules, chiffres et tirets.', half: true },
      { key: 'featured', label: 'Projet phare', type: 'checkbox', half: true },
      { key: 'summary', label: 'Résumé', type: 'textarea', max: 500 },
      { key: 'description', label: 'Description détaillée', type: 'textarea', max: 10000 },
      { key: 'techStack', label: 'Technologies', type: 'tags', placeholder: 'Angular, Spring Boot, PostgreSQL', hint: 'Séparées par des virgules (20 max).' },
      { key: 'githubUrl', label: 'Lien GitHub', type: 'url', max: 500, placeholder: 'https://github.com/…' },
      { key: 'demoUrl', label: 'Lien démo', type: 'url', max: 500, placeholder: 'https://…' },
      { key: 'coverImageUrl', label: 'Image de couverture (URL)', type: 'url', max: 500, placeholder: 'https://…' },
    ],
  },
  {
    key: 'skills', route: 'skills', label: 'Compétences', singular: 'Compétence', icon: 'code',
    title: (i) => str(i['name']),
    detail: (i) => `${str(i['category'])} · ${str(i['levelPct'])} %`,
    fields: [
      { key: 'name', label: 'Nom', type: 'text', required: true, max: 100, half: true },
      { key: 'category', label: 'Catégorie', type: 'text', required: true, max: 60, placeholder: 'Frontend, Backend, Data…', half: true },
      { key: 'levelPct', label: 'Niveau (%)', type: 'range', min: 0, max: 100, default: 70 },
    ],
  },
  {
    key: 'experiences', route: 'experiences', label: 'Expériences', singular: 'Expérience', icon: 'briefcase',
    title: (i) => str(i['roleTitle']),
    detail: (i) => str(i['company']),
    fields: [
      { key: 'roleTitle', label: 'Poste', type: 'text', required: true, max: 200 },
      { key: 'company', label: 'Entreprise', type: 'text', required: true, max: 200, half: true },
      { key: 'location', label: 'Lieu', type: 'text', max: 120, half: true },
      { key: 'startDate', label: 'Début', type: 'date', required: true, half: true },
      { key: 'endDate', label: 'Fin', type: 'date', half: true, hint: 'Vide = en cours.' },
      { key: 'description', label: 'Description', type: 'textarea', max: 5000 },
    ],
  },
  {
    key: 'educations', route: 'educations', label: 'Formations', singular: 'Formation', icon: 'book',
    title: (i) => str(i['degree']),
    detail: (i) => `${str(i['school'])} · ${str(i['startYear'])}${i['endYear'] ? '—' + str(i['endYear']) : ''}`,
    fields: [
      { key: 'degree', label: 'Diplôme', type: 'text', required: true, max: 200 },
      { key: 'school', label: 'École', type: 'text', required: true, max: 200 },
      { key: 'startYear', label: 'Année de début', type: 'number', required: true, min: 1950, max: 2100, half: true },
      { key: 'endYear', label: 'Année de fin', type: 'number', min: 1950, max: 2100, half: true },
      { key: 'description', label: 'Description', type: 'textarea', max: 2000 },
    ],
  },
  {
    key: 'certifications', route: 'certifications', label: 'Certifications', singular: 'Certification', icon: 'award',
    title: (i) => str(i['title']),
    detail: (i) => str(i['issuer']),
    fields: [
      { key: 'title', label: 'Titre', type: 'text', required: true, max: 200 },
      { key: 'issuer', label: 'Organisme', type: 'text', required: true, max: 200, half: true },
      { key: 'issuedOn', label: 'Date d’obtention', type: 'date', half: true },
      { key: 'credentialUrl', label: 'Lien de vérification', type: 'url', max: 500, placeholder: 'https://…' },
    ],
  },
  {
    key: 'social-links', route: 'social-links', label: 'Réseaux', singular: 'Réseau', icon: 'share',
    title: (i) => str(i['platform']),
    detail: (i) => str(i['url']),
    fields: [
      { key: 'platform', label: 'Plateforme', type: 'text', required: true, max: 60, placeholder: 'GitHub', half: true },
      { key: 'iconKey', label: 'Clé d’icône', type: 'text', max: 40, pattern: '^[a-z0-9-]{1,40}$', placeholder: 'github', hint: 'github, linkedin…', half: true },
      { key: 'url', label: 'URL', type: 'url', required: true, max: 500, placeholder: 'https://…' },
    ],
  },
];

export const RESOURCE_BY_ROUTE: Record<string, ResourceDef> = Object.fromEntries(RESOURCES.map((r) => [r.route, r]));

export { URL_RE };

function tagsToArray(v: unknown): string[] {
  const list = Array.isArray(v) ? v : str(v).split(',');
  return list.map((s) => str(s).trim()).filter(Boolean);
}

/** Valeurs de formulaire (ou item existant) → corps de requête conforme au DTO Request du backend. */
export function toPayload(def: ResourceDef, raw: Record<string, unknown>, published: boolean, displayOrder: number): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of def.fields) {
    const v = raw[f.key];
    switch (f.type) {
      case 'checkbox': out[f.key] = !!v; break;
      case 'number':
      case 'range': out[f.key] = v === null || v === undefined || v === '' ? null : Number(v); break;
      case 'tags': out[f.key] = tagsToArray(v); break;
      default: { const s = str(v).trim(); out[f.key] = s === '' ? null : s; } // '' → null : sinon @Pattern/@Email échouent
    }
  }
  out['published'] = published;
  out['displayOrder'] = displayOrder;
  return out;
}
