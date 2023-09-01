/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Injectable, OnInit, Optional } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from 'environments/env';
import { EMPTY, Observable, from, share, tap } from 'rxjs';

@Injectable()
export class NotificationService {
  token$: Observable<any> = EMPTY;
  message$: Observable<any> = EMPTY;
  showRequest = false;

  constructor(@Optional() private messaging: Messaging) {
    console.log('Notification service initialized');
    if (messaging) {
      console.log('passing messaging if statement');
      this.token$ = this.getToken();
      this.message$ = this.getMessage();
    }
  }
  getToken() {
    return from(
      navigator.serviceWorker
        .register('firebase-messaging-sw.js', { type: 'module', scope: '__' })
        .then(serviceWorkerRegistration =>
          getToken(this.messaging, {
            serviceWorkerRegistration,
            vapidKey: environment.vapidKey,
          })
        )
    ).pipe(
      tap(token => console.log('FCM', { token })),
      share()
    );
  }
  getMessage() {
    return new Observable(sub =>
      onMessage(this.messaging, it => sub.next(it))
    ).pipe(tap(token => console.log('FCM', { token })));
  }

  request() {
    Notification.requestPermission();
  }
}
