/* eslint-disable @typescript-eslint/naming-convention */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthFacade } from '@shared/features/auth/services/auth.facade';
import { Observable, switchMap, catchError, throwError } from 'rxjs';
@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private AuthFacade: AuthFacade) {}
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      return this.AuthFacade.getCurrentUser().pipe(
        switchMap(user => {
          if (user) {
            const authReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${user.token}`),
            });
            return next.handle(authReq);
          } else {
            throw new Error('Token not found');
          }
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
