import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpsReplaceInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // clone request and replace 'http://' with 'https://' at the same time
    const secure = req.clone({
      url: req.url.replace('http://', 'https://'),
    });
    // send the cloned, "secure" request to the next handler.
    return next.handle(secure);
  }
}
