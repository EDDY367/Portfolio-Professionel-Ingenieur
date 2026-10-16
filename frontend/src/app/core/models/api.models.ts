/** Types miroirs des DTO du backend (com.eddy.portfolio.dto). Dates LocalDate = "YYYY-MM-DD". */

export interface Profile {
  id: number;
  fullName: string;
  headline: string;
  bio: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  photoUrl: string | null;
  cvUrl: string | null;
}
export type ProfileRequest = Omit<Profile, 'id'>;

export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  coverImageUrl: string | null;
  featured: boolean;
  published: boolean;
  displayOrder: number;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  levelPct: number;
  published: boolean;
  displayOrder: number;
}

export interface Experience {
  id: number;
  roleTitle: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  published: boolean;
  displayOrder: number;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  startYear: number;
  endYear: number | null;
  description: string | null;
  published: boolean;
  displayOrder: number;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  issuedOn: string | null;
  credentialUrl: string | null;
  published: boolean;
  displayOrder: number;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  iconKey: string | null;
  published: boolean;
  displayOrder: number;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject?: string | null;
  body: string;
  /** Pot de miel : doit rester vide. */
  website?: string;
}

export interface Message {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string | null;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}
export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

/** Erreur RFC 7807 renvoyée par GlobalExceptionHandler. */
export interface ProblemDetail {
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string>;
}
