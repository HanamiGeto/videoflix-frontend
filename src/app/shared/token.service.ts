import { Injectable } from '@angular/core';
import { Tokens } from './model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setTokens(tokens: Tokens): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem('access_token', accessToken);
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
