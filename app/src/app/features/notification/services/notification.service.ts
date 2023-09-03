/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable, OnInit, Optional } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { environment } from 'environments/env';
import {
  firstValueFrom,
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
    private http: HttpClient,
    private authFacade: AuthFacade
  ) {
    console.log('Notification service initialized');
    console.log(this.messaging);
    if (this.messaging) {
      console.log('passing messaging if statement');
      this.token$ = this.getToken();
      this.message$ = this.getMessage();
      this.token$.pipe(debounceTime(2000)).subscribe(async token => {
        console.log('token', token);
        if (await authFacade.isLoggedIn()) {
          this.updateDeviceToken(token);
        }
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
    ).pipe(debounceTime(2000), share());
  }
  getMessage() {
    return new Observable(sub => onMessage(this.messaging, it => sub.next(it)));
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
  async getUnreadCount() {
    console.log('get unread count');
    const url = `${this.apiUrl}count/unread/`;
    const res = await firstValueFrom(
      this.http.post<any>(
        url,
        {},
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
        }
      )
    );
    console.log('res', res);
    return res.unread_count;
  }
}
