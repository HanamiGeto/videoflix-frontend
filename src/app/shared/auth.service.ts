interface Tokens {
  access: string;
  refresh: string;
}

interface User extends Tokens {
  id: number;
  username: string;
  email: string;
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  readonly isAuthenticated = signal(false);

  signup(userData: { username: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}accounts/signup/`, userData);
  }

  login(userData: { email: string; password: string }) {
    return this.http.post<User>(`${this.apiUrl}accounts/login/`, userData).pipe(
      tap((result) => {
        localStorage.setItem('access_token', result.access);
        localStorage.setItem('refresh_token', result.refresh);
        this.isAuthenticated.set(true);
      }),
    );
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post<Tokens>(`${this.apiUrl}accounts/token/refresh/`, {
        refresh: refreshToken,
      })
      .pipe(
        tap((result) => {
          localStorage.setItem('access_token', result.access);
        }),
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticated.set(false);
  }
}
