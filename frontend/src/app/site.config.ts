/**
 * Textes éditoriaux de la maquette qui n'ont pas (encore) de champ dans l'API.
 * Tout ce qui existe dans le backend (profil, projets, compétences...) vient de l'API.
 */
export const SITE = {
  /** Nom affiché dans le logo tant que le profil n'est pas chargé (ou sur la page de connexion). */
  brandFallback: 'DOFFOU EDDY YANN',
  /** Photo par défaut (fichier du dossier public/) quand profile.photoUrl est vide. */
  defaultPhoto: 'eddy-photo.jpg',
  availability: 'Disponible pour un stage',
  heroTitle: { line1: 'J’ingénierie', line2: 'les ', accent: 'données.' },
  heroNote: ['Data Engineering', 'Cloud · IA · Security'],
  coordinates: '05°20′ N\u00A0\u00A0 04°01′ W',
  quote: { before: 'Je crois que les meilleurs systèmes sont ceux que l’on ne remarque pas : ', strong: 'simples à utiliser, difficiles à casser.' },
  principles: ['Comprendre avant de construire', 'Automatiser ce qui peut l’être', 'Documenter pour transmettre'],
  /** Accroche affichée sur les cartes de compétences, selon la catégorie (insensible à la casse). */
  categoryTitles: {
    data: 'Transformer la donnée en décisions.',
    cloud: 'Concevoir des systèmes fiables.',
    devops: 'Concevoir des systèmes fiables.',
    backend: 'Construire des services solides.',
    frontend: 'Développer des produits utiles.',
    build: 'Développer des produits utiles.',
    security: 'Sécuriser chaque couche.',
    ml: 'Apprendre à partir des données.',
    'machine learning': 'Apprendre à partir des données.',
    'deep learning': 'Des réseaux qui apprennent seuls.',
    dl: 'Des réseaux qui apprennent seuls.',
    ia: 'Mettre l’intelligence au service du produit.',
    ai: 'Mettre l’intelligence au service du produit.',
    'data science': 'Transformer la donnée en décisions.',
    mlops: 'Mettre les modèles en production.',
    secure: 'Sécuriser chaque couche.',
  } as Record<string, string>,
  fallbackCategoryTitle: 'Une compétence, des preuves.',
};
