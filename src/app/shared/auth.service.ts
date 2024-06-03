import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  register(userData: { username: string; email: string; password: string }) {
    // return this.http.post(`${this.baseURL}/register`, { ...userData });
    console.log(userData);
  }

  login(userData: { email: string; password: string }) {
    // return this.http.post(`${this.baseURL}/register`, { ...userData });
    console.log(userData);
  }
}
