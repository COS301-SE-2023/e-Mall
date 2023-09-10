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
  @Select(NotificationSelectors.getCount)
  count$!: Observable<number>;

  newMessage$ = new BehaviorSubject<INotification | null>(null);
  messageListenSubs = new Subscription();
  authSubs = new Subscription();
  isMenuOpen$ = new BehaviorSubject<boolean>(false);
  isInitial = true;
  token = '';
  constructor(
    private notificationService: NotificationService,
    authfacade: AuthFacade
  ) {
    console.log('Notification Facade initialized');
    this.authSubs = authfacade
      .getCurrentUser()
      .pipe(debounceTime(100))
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
    this.token = token;
    this.resetNotifications();
    this.isInitial = true;
    this.getUnreadCount();

    this.messageListenSubs = this.notificationService.message$
      .pipe(debounceTime(500))
      .subscribe((message: any) => {
        console.log('Listening for messages');
        if (message) {
          console.log(message);
          const payload = transformMessage(message);
          this.newNotification(payload);
        }
      });
  }
  async getNotifications() {
    if (this.isInitial) {
      this.isInitial = false;
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
  }

  async loadMoreNotifications() {
    try {
      const hasNext = await firstValueFrom(this.hasNext$);

      if (hasNext) {
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
  async read(id: string) {
    try {
      this.markReadInState(id);
      const res = await this.notificationService.read(id);
      return res;
    } catch (error) {
      return this.setError(error);
    }
  }

  async signOut() {
    // Delete the FCM registration token
    await this.notificationService.signOut();
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
  async readAll() {
    try {
      this.readAllState();
      const res = await this.notificationService.readAll();
      return res;
    } catch (error) {
      return this.setError(error);
    }
  }
  async deleteAll() {
    try {
      const res = await this.notificationService.deleteAll();
      this.deleteAllState();
      return res;
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  markReadInState(id: string) {
    return new NotificationActions.Read(id);
  }
  @Dispatch()
  deleteAllState() {
    return new NotificationActions.DeleteAll();
  }
  @Dispatch()
  readAllState() {
    return new NotificationActions.ReadAll();
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
      return new NotificationActions.NewNotification(message, this.isInitial);
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
