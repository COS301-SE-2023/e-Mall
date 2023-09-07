/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { NotificationService } from './notification.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  debounceTime,
  take,
  firstValueFrom,
} from 'rxjs';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { NotificationState } from '../states/notification.state';
import { INotification } from '../models/notification.interface';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { SetError } from '@features/error/states/error.action';
import { IError } from '@features/error/models/error.interface';
import * as NotificationActions from '../states/notification.action';
import { IUser } from '../../auth/models/user.interface';
import { Select } from '@ngxs/store';
import { NotificationSelectors } from '../states/notification.selector';
import { transformMessage } from '../utils/transformMessage';
@Injectable()
export class NotificationFacade implements OnDestroy {
  @Select(NotificationSelectors.getUnreadCount)
  unread_count$!: Observable<number>;
  @Select(NotificationSelectors.getNotifications)
  notificationList$!: Observable<INotification[] | null>;
  @Select(NotificationSelectors.getLastNotification)
  lastNotification$!: Observable<string | null>;
  @Select(NotificationSelectors.hasNext)
  hasNext$!: Observable<boolean>;

  newMessage$ = new BehaviorSubject<INotification | null>(null);
  messageListenSubs = new Subscription();
  authSubs = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private notificationState: NotificationState,
    private authfacade: AuthFacade
  ) {
    console.log('Notification Facade initialized');
    this.authSubs = authfacade
      .getCurrentUser()
      .pipe(debounceTime(1000))
      .subscribe(async (user: IUser | null) => {
        if (user != null) {
          await notificationService.request().then(permission => {
            if (permission === 'granted') {
              notificationService
                .getToken()
                .pipe(debounceTime(100), take(1))
                .subscribe(async token => {
                  this.init(token);
                });
            } else {
              console.log('Notification is disabled');
            }
          });
        } else {
          this.messageListenSubs.unsubscribe();
          this.signOut();
        }
      });
  }
  async init(token: string) {
    await this.updateDeviceToken(token);
    this.resetNotifications();
    this.getUnreadCount();

    this.messageListenSubs = this.notificationService.message$
      .pipe(debounceTime(500))
      .subscribe((message: any) => {
        console.log('Listening for messages');
        if (message) {
          const payload = transformMessage(message);
          this.newNotification(payload);
        }
      });
  }

  async getNotifications() {
    try {
      const hasNext = await firstValueFrom(this.hasNext$);
      const initial = (await firstValueFrom(this.notificationList$)) === null;
      if (initial || hasNext) {
        const lastNotificationId = await firstValueFrom(this.lastNotification$);
        const res = await this.notificationService.getNotifications(
          lastNotificationId
        );
        let tmp_list = [];
        if (res.notifications.length > 0) {
          tmp_list = res.notifications.map(transformMessage);
        }
        this.updateNotificationList(tmp_list, res.has_next);
      }
      return null;
    } catch (error) {
      return this.setError(error);
    }
  }

  async signOut() {
    // Delete the FCM registration token

    // Unregister the service worker
    navigator.serviceWorker
      .getRegistrations()
      .then(function (registrations) {
        for (const registration of registrations) {
          registration.unregister();
        }
      })
      .catch(function (err) {
        console.log('Service Worker registration failed: ', err);
      });
  }

  @Dispatch()
  updateNotificationList(
    transformedNotifications: INotification[],
    has_next: boolean
  ) {
    return new NotificationActions.Update(transformedNotifications, has_next);
  }
  @Dispatch()
  async getUnreadCount() {
    try {
      const count = await this.notificationService.getUnreadCount();
      return new NotificationActions.SetUnreadCount(count);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  async newNotification(message: INotification) {
    try {
      this.newMessage$.next(message);
      return new NotificationActions.NewNotification(message);
    } catch (error) {
      return this.setError(error);
    }
  }
  @Dispatch()
  resetNotifications() {
    return new NotificationActions.ResetNotifications();
  }
  @Dispatch()
  setError(error: unknown) {
    return new SetError('notification', error as IError);
  }
  @Dispatch()
  async updateDeviceToken(token: string) {
    this.notificationService.updateDeviceToken(token);
    return new NotificationActions.SetToken(token);
  }

  ngOnDestroy(): void {
    this.messageListenSubs.unsubscribe();
  }
}
