import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  signup(userData: { username: string; email: string; password: string }) {
    console.log(userData);
    return this.http.post(`${this.apiUrl}accounts/signup/`, userData);
  }

  login(userData: { email: string; password: string }) {
    console.log(userData);
    return this.http.post(`${this.apiUrl}accounts/login/`, userData).pipe(
      tap((result) => {
        localStorage.setItem('authUser', JSON.stringify(result));
      }),
    );
  }

  logout() {
    localStorage.removeItem('authUser');
  }

  isLoggedIn() {
    return localStorage.getItem('authUser') !== null;
  }
}
