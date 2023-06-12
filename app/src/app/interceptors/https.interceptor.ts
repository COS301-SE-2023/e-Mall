import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
/*
implemented later if needed. this should change http to https
didnt test yet. add to index.ts if needed
*/
@Injectable()
export class HttpsReplaceInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // clone request and replace 'http://' with 'https://' at the same time
    const secure = req.clone({
      url: req.url.replace('http://', 'https://'),
    });
    return next.handle(secure);
  }
}
