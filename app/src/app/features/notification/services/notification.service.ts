/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable, OnInit, Optional } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from 'environments/env';
import {
  EMPTY,
  Observable,
  debounceTime,
  from,
  share,
  tap,
  lastValueFrom,
} from 'rxjs';

@Injectable()
export class NotificationService {
  private apiUrl = '/api/notification/';
  token$: Observable<any> = EMPTY;
  message$: Observable<any> = EMPTY;
  showRequest = false;

  constructor(
    @Optional() private messaging: Messaging,
    private http: HttpClient
  ) {
    console.log('Notification service initialized');
    if (messaging) {
      console.log('passing messaging if statement');
      this.token$ = this.getToken();
      this.message$ = this.getMessage();
      this.token$.pipe(debounceTime(2000)).subscribe(token => {
        console.log('token', token);
        this.updateDeviceToken(token);
      });
    }
  }
  getToken() {
    console.log('get token');
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
      debounceTime(2000),
      tap(token => {
        console.log('FCM', { token });
      }),
      share()
    );
  }
  getMessage() {
    return new Observable(sub =>
      onMessage(this.messaging, it => sub.next(it))
    ).pipe(tap(token => console.log('FCM on message', { token })));
  }

  request() {
    Notification.requestPermission();
  }
  async updateDeviceToken(token: string) {
    console.log('update device token');
    const url = `${this.apiUrl}device/`;
    const res = await lastValueFrom(
      this.http.post(
        url,
        {
          device_token: token,
        },
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
        }
      )
    );
    console.log(res);
  }
}
