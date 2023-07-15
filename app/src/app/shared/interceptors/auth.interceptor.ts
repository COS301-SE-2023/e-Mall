/* eslint-disable @typescript-eslint/naming-convention */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthFacade } from '@app/features/auth/services/auth.facade';
import { Observable, switchMap, catchError, throwError, from } from 'rxjs';
@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private authFacade: AuthFacade) {}
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      return this.authFacade.getCurrentUser().pipe(
        switchMap(user => {
          if (user) {
            // check if the access token has expired
            if (isTokenExpired(user.token)) {
              return from(this.authFacade.refreshAccessToken()).pipe(
                switchMap(newAccessToken => {
                  // clone the request and set the new access token
                  const authReq = req.clone({
                    headers: req.headers.set(
                      'Authorization',
                      `Bearer ${newAccessToken}`
                    ),
                  });
                  return next.handle(authReq);
                })
              );
            } else {
              // clone the request and set the access token
              const authReq = req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${user.token}`
                ),
              });
              return next.handle(authReq);
            }
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
function isTokenExpired(token: string) {
  // decode the token
  const payload = JSON.parse(atob(token.split('.')[1]));
  // get the expiration time
  const expirationTime = payload.exp;
  // check if the token has expired
  return Date.now() > expirationTime * 1000;
}
