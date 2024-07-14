import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
import { Tokens, User } from './model';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private tokenService = inject(TokenService);
  // readonly isAuthenticated = signal(true);

  signup(userData: { username: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}accounts/signup/`, userData);
  }

  login(userData: { email: string; password: string }) {
    return this.http.post<User>(`${this.apiUrl}accounts/login/`, userData).pipe(
      tap((token) => {
        this.tokenService.setTokens(token);
        // this.isAuthenticated.set(true);
      }),
    );
  }

  requestPasswordReset(userEmail: { email: string }) {
    return this.http.post(`${this.apiUrl}accounts/password_reset/`, userEmail);
  }

  refreshToken() {
    return this.http
      .post<Tokens>(`${this.apiUrl}accounts/token/refresh/`, {
        refresh: this.tokenService.getRefreshToken(),
      })
      .pipe(
        tap((token) => {
          this.tokenService.setAccessToken(token.access);
        }),
      );
  }

  logout() {
    this.tokenService.clearTokens();
    // this.isAuthenticated.set(false);
  }

  isLoggedIn() {
    return this.tokenService.getAccessToken() !== null;
  }
}
