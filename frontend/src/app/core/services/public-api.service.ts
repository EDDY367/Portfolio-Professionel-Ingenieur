import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Certification, ContactRequest, Education, Experience, Profile, Project, Skill, SocialLink,
} from '../models/api.models';

/** Endpoints publics (lecture seule + contact) : GET /api/v1/... */
@Injectable({ providedIn: 'root' })
export class PublicApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  profile(): Observable<Profile> { return this.http.get<Profile>(`${this.base}/profile`); }
  projects(): Observable<Project[]> { return this.http.get<Project[]>(`${this.base}/projects`); }
  project(slug: string): Observable<Project> { return this.http.get<Project>(`${this.base}/projects/${encodeURIComponent(slug)}`); }
  skills(): Observable<Skill[]> { return this.http.get<Skill[]>(`${this.base}/skills`); }
  experiences(): Observable<Experience[]> { return this.http.get<Experience[]>(`${this.base}/experiences`); }
  educations(): Observable<Education[]> { return this.http.get<Education[]>(`${this.base}/educations`); }
  certifications(): Observable<Certification[]> { return this.http.get<Certification[]>(`${this.base}/certifications`); }
  socialLinks(): Observable<SocialLink[]> { return this.http.get<SocialLink[]>(`${this.base}/social-links`); }

  /** 202 Accepted sans corps. */
  sendContact(payload: ContactRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/contact`, payload);
  }
}
