// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { finalize } from 'rxjs/operators';
// import { LoaderService } from '../services/loader.service';

// @Injectable()
// export class LoadingInterceptor implements HttpInterceptor {

//   private totalRequests = 0;
//   private isIntercepted = false;

//   constructor(private loadingService: LoaderService) {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     if (!this.isIntercepted) {
//       console.log('Intercepted');
//       this.isIntercepted = true; // Mark as intercepted

//       this.loadingService.setLoading(true);

//       return next.handle(request).pipe(
//         finalize(() => {
//           this.loadingService.setLoading(false);
//         })
//       );
//     }
//     // If already intercepted, pass the request without intercepting again.
//     return next.handle(request);
//   }

// }
