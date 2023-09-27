/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import {
  Messaging,
  getToken,
  onMessage,
  isSupported,
} from '@angular/fire/messaging';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { environment } from 'environments/env';
import { firstValueFrom, EMPTY, Observable } from 'rxjs';
import { INotificationSettings } from '../models/notification-settings.interface';

@Injectable()
export class NotificationService {
  private apiUrl = '/api/notification/';
  // token$: Observable<any> = EMPTY;
  message$: Observable<any> = EMPTY;

  constructor(
    @Optional() private messaging: Messaging,
    private http: HttpClient
  ) {
    isSupported().then((supported: any) => {
      if (supported) {
        if (this.messaging) {
          // this.token$ = this.getToken();
          this.message$ = this.getMessage();
        }
      }
    });
  }

  async signOut() {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    
  }
  getToken() {
    // return from(
    return navigator.serviceWorker
      .register('firebase-messaging-sw.js', { type: 'module', scope: '__' })
      .then(serviceWorkerRegistration => {
        return getToken(this.messaging, {
          serviceWorkerRegistration,
          vapidKey: environment.firebase.vapidKey,
        });
      });
    // );
  }
  getMessage() {
    return new Observable(sub => onMessage(this.messaging, it => sub.next(it)));
  }

  async request() {
    return await Notification.requestPermission();
  }
  async updateDeviceToken(token: string) {
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
  async updateSettings(settings: INotificationSettings) {
    const url = `${this.apiUrl}settings/update/`;
    return await firstValueFrom(
      this.http.post(
        url,
        { settings },
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
        }
      )
    );
  }
  async getSettings(): Promise<INotificationSettings> {
    const url = `${this.apiUrl}settings/get/`;
    const res = await firstValueFrom(
      this.http.post<INotificationSettings>(
        url,
        {},
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
        }
      )
    );
    return res;
  }
}
