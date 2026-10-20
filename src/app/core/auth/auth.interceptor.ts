import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const url = new URL(request.url, location.origin);
  const api = new URL(environment.apiUrl);
  if (url.origin !== api.origin || !(url.pathname === '/api/games' || url.pathname.startsWith('/api/games/'))) return next(request);
  const auth = inject(AuthService);
  return from(auth.accessToken()).pipe(switchMap(token => {
    return next(request.clone({setHeaders: {Authorization: `Bearer ${token}`}}));
  }));
};
