import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message, PageResponse, Profile, ProfileRequest } from '../models/api.models';

/** Ressources CRUD génériques exposées par AbstractAdminController. */
export type ResourceKey = 'projects' | 'skills' | 'experiences' | 'educations' | 'certifications' | 'social-links';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin`;

  list<T>(resource: ResourceKey): Observable<T[]> { return this.http.get<T[]>(`${this.base}/${resource}`); }
  create<T>(resource: ResourceKey, body: object): Observable<T> { return this.http.post<T>(`${this.base}/${resource}`, body); }
  update<T>(resource: ResourceKey, id: number, body: object): Observable<T> { return this.http.put<T>(`${this.base}/${resource}/${id}`, body); }
  remove(resource: ResourceKey, id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${resource}/${id}`); }

  profile(): Observable<Profile> { return this.http.get<Profile>(`${this.base}/profile`); }
  saveProfile(body: ProfileRequest): Observable<Profile> { return this.http.put<Profile>(`${this.base}/profile`, body); }

  messages(page = 0, size = 20): Observable<PageResponse<Message>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Message>>(`${this.base}/messages`, { params });
  }
  unreadCount(): Observable<{ unread: number }> { return this.http.get<{ unread: number }>(`${this.base}/messages/unread-count`); }
  markRead(id: number, read: boolean): Observable<Message> { return this.http.patch<Message>(`${this.base}/messages/${id}/read`, { read }); }
  deleteMessage(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/messages/${id}`); }
}
