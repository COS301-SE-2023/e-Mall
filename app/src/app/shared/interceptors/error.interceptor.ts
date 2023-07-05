import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { ErrorFacade } from '@shared/features/error/services/error.facade';
import { IError } from '@shared/features/error/models/error.interface';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private errorFacade: ErrorFacade) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let err_message = '';
        let error_code = -1; //front error
        if (error.error instanceof ErrorEvent) {
          //front side error
          err_message = error.error.message;
        } else {
          //backend side error
          error_code = error.status;
          err_message = error.message;
        }
        return throwError(() => new IError(error_code, err_message));
      })
    );
  }
}
