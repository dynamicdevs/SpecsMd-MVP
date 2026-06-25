import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/enums';
import {
  Friction,
  FrictionCreate,
  FrictionUpdate,
} from '../models/friction.model';

@Injectable({ providedIn: 'root' })
export class FrictionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/frictions`;

  list(): Observable<Friction[]> {
    return this.http.get<Friction[]>(this.baseUrl);
  }

  get(id: number): Observable<Friction> {
    return this.http.get<Friction>(`${this.baseUrl}/${id}`);
  }

  create(payload: FrictionCreate): Observable<Friction> {
    return this.http.post<Friction>(this.baseUrl, payload);
  }

  update(id: number, payload: FrictionUpdate): Observable<Friction> {
    return this.http.put<Friction>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  classify(text: string): Observable<{ category: Category }> {
    return this.http.post<{ category: Category }>(`${this.baseUrl}/classify`, { text });
  }
}
