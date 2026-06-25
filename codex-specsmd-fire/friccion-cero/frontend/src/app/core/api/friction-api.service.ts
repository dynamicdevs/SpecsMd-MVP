import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type {
  CreateFrictionRequest,
  Friction,
  FrictionComment,
  FrictionDetail,
  UpdateFrictionRequest
} from '../models/friction.model';

@Injectable({ providedIn: 'root' })
export class FrictionApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/frictions`;

  public list() {
    return this.http.get<Friction[]>(this.baseUrl);
  }

  public get(id: string) {
    return this.http.get<FrictionDetail>(`${this.baseUrl}/${id}`);
  }

  public create(payload: CreateFrictionRequest) {
    return this.http.post<Friction>(this.baseUrl, payload);
  }

  public update(id: string, payload: UpdateFrictionRequest) {
    return this.http.put<Friction>(`${this.baseUrl}/${id}`, payload);
  }

  public delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  public listComments(frictionId: string) {
    return this.http.get<FrictionComment[]>(`${this.baseUrl}/${frictionId}/comments`);
  }

  public createComment(frictionId: string, comment: string) {
    return this.http.post<FrictionComment>(`${this.baseUrl}/${frictionId}/comments`, { comment });
  }
}
