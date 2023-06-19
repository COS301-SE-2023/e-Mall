/* eslint-disable @typescript-eslint/naming-convention */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { Observable, switchMap, catchError, throwError } from 'rxjs';
@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      return this.authService.getAccessTokenCognito().pipe(
        switchMap(jwtToken => {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
          });
          return next.handle(authReq);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            throw new Error('Invalid auth token');
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }
}
