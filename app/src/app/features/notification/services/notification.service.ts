/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import {
  Messaging,
  getToken,
  onMessage,
  isSupported,
} from '@angular/fire/messaging';
import { environment } from 'environments/env';
import { firstValueFrom, Observable, Subject, filter, take } from 'rxjs';
import { INotificationSettings } from '../models/notification-settings.interface';
// import { collection, onSnapshot, Firestore } from '@angular/fire/firestore';
import { ProfileFacade } from '@app/features/profile/services/profile.facade';
// import {  } from '@angular/fire/compat/firestore';
import {
  // Firestore,
  collection,
  onSnapshot,
  Firestore,
} from '@angular/fire/firestore';
@Injectable()
export class NotificationService {
  // firestore: Firestore = inject(Firestore);

  private apiUrl = '/api/notification/';
  // token$: Observable<any> = EMPTY;
  message$ = new Subject<any>();
  // message$: Observable<any> = EMPTY;
  unsubscribe$: any;
  constructor(
    @Optional() private messaging: Messaging,
    private firestore: Firestore,
    private http: HttpClient,
    private profileFacade: ProfileFacade // private firestore: AngularFirestore
  ) {
    isSupported().then((supported: any) => {
      if (supported) {
        if (this.messaging) {
          // this.token$ = this.getToken();
          this.getMessage();
        }
      }
    });

    let user_id: string;

    this.profileFacade
      .getProfile()
      .pipe(
        filter(profile => profile !== null && profile !== undefined),
        take(1)
      )
      .subscribe(profile => {
        if (profile?.id && profile.type === 'consumer') {
          user_id = profile.id;

          // Listen to a Firestore collection

          const userLogsCollection = collection(
            this.firestore,
            `users/${user_id}/logs`
          );
          let initial_load = true;
          this.unsubscribe$ = onSnapshot(
            userLogsCollection,
            (snapshot: any) => {
              if (initial_load) {
                initial_load = false;
                return;
              }
              snapshot.docChanges().forEach((change: any) => {
                if (change.type === 'added') {
                  const data = change.doc.data();
                  console.log('New message: ', data);
                  this.message$.next(data);
                }
              });
            }
          );
        }
      });
  }

  async signOut() {
    if (this.unsubscribe$) this.unsubscribe$();
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
