/* eslint-disable @typescript-eslint/naming-convention */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoService } from '@app/services/cognito.service';
import { Observable, switchMap, catchError, throwError } from 'rxjs';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private cognitoService: CognitoService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[AuthHttpInterceptor');
    console.log(req);
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      return this.cognitoService.getAccessToken().pipe(
        switchMap(jwtToken => {
          // clone the request to add the new header.
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
          });
          return next.handle(authReq);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Throw an error with the message you want to pass
            throw new Error('Invalid auth token');
          }
          return throwError(() => error);
        })
      );
    }
    console.log('[Auth]Interceptor: No authorization required.');
    return next.handle(req);
  }
}
