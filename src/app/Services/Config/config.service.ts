import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private apiUrl = `${API_CONFIG.baseUrl}/configurations/public`;

  constructor(private http: HttpClient) {}

  getPublicConfigurations(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
