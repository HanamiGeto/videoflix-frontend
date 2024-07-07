import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { TokenService } from './token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (authService.isLoggedIn() && tokenService.getAccessToken() !== null) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
