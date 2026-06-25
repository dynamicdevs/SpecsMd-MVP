import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type {
  CreateInitiativeRequest,
  Initiative,
  UpdateInitiativeRequest
} from '../models/initiative.model';

@Injectable({ providedIn: 'root' })
export class InitiativeApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/initiatives`;

  public list() {
    return this.http.get<Initiative[]>(this.baseUrl);
  }

  public get(id: string) {
    return this.http.get<Initiative>(`${this.baseUrl}/${id}`);
  }

  public createFromFriction(frictionId: string, payload: CreateInitiativeRequest) {
    return this.http.post<Initiative>(
      `${environment.apiBaseUrl}/api/frictions/${frictionId}/initiatives`,
      payload
    );
  }

  public update(id: string, payload: UpdateInitiativeRequest) {
    return this.http.put<Initiative>(`${this.baseUrl}/${id}`, payload);
  }

  public delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
