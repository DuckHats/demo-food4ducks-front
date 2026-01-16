import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class TwoFactorAuthService {
  private baseUrl = `${API_CONFIG.baseUrl}/auth/2fa`;

  constructor(private http: HttpClient) {}

  generateSecret(): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate`, {});
  }

  enable2FA(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/enable`, { code });
  }

  disable2FA(): Observable<any> {
    return this.http.post(`${this.baseUrl}/disable`, {});
  }
}
