import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Initiative, InitiativeCreate } from '../../shared/models/friction.model';

@Injectable({ providedIn: 'root' })
export class InitiativeService {
  private readonly baseUrl = `${environment.apiUrl}/initiatives`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Initiative[]> {
    return this.http.get<Initiative[]>(this.baseUrl);
  }

  getById(id: number): Observable<Initiative> {
    return this.http.get<Initiative>(`${this.baseUrl}/${id}`);
  }

  create(data: InitiativeCreate): Observable<Initiative> {
    return this.http.post<Initiative>(this.baseUrl, data);
  }

  update(id: number, data: Partial<Initiative>): Observable<Initiative> {
    return this.http.put<Initiative>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
