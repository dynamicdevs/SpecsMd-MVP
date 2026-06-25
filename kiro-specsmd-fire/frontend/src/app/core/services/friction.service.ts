import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Friction,
  FrictionCreate,
  FrictionComment,
  Initiative,
} from '../../shared/models/friction.model';

@Injectable({ providedIn: 'root' })
export class FrictionService {
  private readonly baseUrl = `${environment.apiUrl}/frictions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Friction[]> {
    return this.http.get<Friction[]>(this.baseUrl);
  }

  getById(id: number): Observable<Friction> {
    return this.http.get<Friction>(`${this.baseUrl}/${id}`);
  }

  create(data: FrictionCreate): Observable<Friction> {
    return this.http.post<Friction>(this.baseUrl, data);
  }

  update(id: number, data: Partial<FrictionCreate>): Observable<Friction> {
    return this.http.put<Friction>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getComments(frictionId: number): Observable<FrictionComment[]> {
    return this.http.get<FrictionComment[]>(
      `${this.baseUrl}/${frictionId}/comments`
    );
  }

  addComment(frictionId: number, comment: string): Observable<FrictionComment> {
    return this.http.post<FrictionComment>(
      `${this.baseUrl}/${frictionId}/comments`,
      { comment }
    );
  }

  getInitiatives(frictionId: number): Observable<Initiative[]> {
    return this.http.get<Initiative[]>(
      `${this.baseUrl}/${frictionId}/initiatives`
    );
  }
}
