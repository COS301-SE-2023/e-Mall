import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[ErrorHttpInterceptor');

    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let err_message = '';
        if (error.error instanceof ErrorEvent) {
          //front side error
          err_message = `Error ${error.error.message}`;
        } else {
          err_message = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(err_message);
        return throwError(() => new Error(err_message));
      })
    );
  }
}
