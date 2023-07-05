import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BaseURLInterceptor implements HttpInterceptor {
  constructor(@Inject('API_URL') private API_URL: string) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Only prefix requests to our own API
    if (request.url.startsWith('/api')) {
      const req = request.clone({ url: `${this.API_URL}${request.url}` });
      return next.handle(req);
    }
    // Pass through requests to external APIs
    return next.handle(request);
  }
}
