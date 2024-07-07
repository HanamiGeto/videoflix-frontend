import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from './token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();
  const reqWithToken = (token: string | null) => {
    return token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;
  };

  const handle401TokenError = (error: HttpErrorResponse) => {
    return authService.refreshToken().pipe(
      switchMap((tokens) => {
        const newToken = tokens.access;
        return next(reqWithToken(newToken));
      }),
      catchError(() => {
        authService.logout();
        return throwError(() => new Error(error.message));
      }),
    );
  };

  if (authService.isLoggedIn() && token) {
    return next(reqWithToken(token)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.code === 'token_not_valid') {
          return handle401TokenError(error);
        }
        return throwError(() => new Error(error.message));
      }),
    );
  } else {
    return next(req);
  }
};
