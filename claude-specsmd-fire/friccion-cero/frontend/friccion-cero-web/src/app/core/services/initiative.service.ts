import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Initiative,
  InitiativeCreate,
  InitiativeUpdate,
} from '../models/initiative.model';

@Injectable({ providedIn: 'root' })
export class InitiativeService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/initiatives`;

  list(): Observable<Initiative[]> {
    return this.http.get<Initiative[]>(this.baseUrl);
  }

  get(id: number): Observable<Initiative> {
    return this.http.get<Initiative>(`${this.baseUrl}/${id}`);
  }

  create(payload: InitiativeCreate): Observable<Initiative> {
    return this.http.post<Initiative>(this.baseUrl, payload);
  }

  update(id: number, payload: InitiativeUpdate): Observable<Initiative> {
    return this.http.put<Initiative>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
