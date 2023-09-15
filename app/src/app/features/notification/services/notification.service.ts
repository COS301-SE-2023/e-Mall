/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import {
  Messaging,
  getToken,
  onMessage,
  deleteToken,
} from '@angular/fire/messaging';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { environment } from 'environments/env';
import { firstValueFrom, EMPTY, Observable, from } from 'rxjs';

@Injectable()
export class NotificationService {
  private apiUrl = '/api/notification/';
  // token$: Observable<any> = EMPTY;
  message$: Observable<any> = EMPTY;

  constructor(
    @Optional() private messaging: Messaging,
    private http: HttpClient,
    private authFacade: AuthFacade
  ) {
    if (this.messaging) {
      // this.token$ = this.getToken();
      this.message$ = this.getMessage();
    }
  }

  async signOut() {
    await deleteToken(this.messaging)
      .then(() => {
        console.log('Token deleted.');
      })
      .catch(err => {
        console.log('Unable to delete token. ', err);
      });
  }
  getToken() {
    return from(
      navigator.serviceWorker
        .register('firebase-messaging-sw.js', { type: 'module', scope: '__' })
        .then(serviceWorkerRegistration =>
          getToken(this.messaging, {
            serviceWorkerRegistration,
            vapidKey: environment.firebase.vapidKey,
          })
        )
    );
  }
  getMessage() {
    return new Observable(sub => onMessage(this.messaging, it => sub.next(it)));
  }

  async request() {
    return await Notification.requestPermission();
  }
  async updateDeviceToken(token: string) {
    console.log('update device token');
    const url = `${this.apiUrl}device/`;
    return await firstValueFrom(
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
  }
  async read(id: string) {
    const url = `${this.apiUrl}read/`;
    return await firstValueFrom(
      this.http.post(
        url,
        {
          notification_id: id,
        },
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
        }
      )
    );
  }
  async delete(id: string) {
    const url = `${this.apiUrl}delete/`;
    return await firstValueFrom(
      this.http.post(
        url,
        {
          notification_id: id,
        },
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
        }
      )
    );
  }
  async getUnreadCount() {
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
    return res.unread_count;
  }
  async getNotifications(lastNotificationId: string | null) {
    const url = `${this.apiUrl}get/`;
    const res = await firstValueFrom(
      this.http.post<any>(
        url,
        { notification_id: lastNotificationId },
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
        }
      )
    );
    return res;
  }
  async readAll() {
    const url = `${this.apiUrl}read/all/`;
    return await firstValueFrom(
      this.http.post(
        url,
        {},
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
        }
      )
    );
  }
  async deleteAll() {
    const url = `${this.apiUrl}delete/all/`;
    return await firstValueFrom(
      this.http.post(
        url,
        {},
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
        }
      )
    );
  }
}
