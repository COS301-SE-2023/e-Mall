/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { NotificationService } from './notification.service';
import {
  EMPTY,
  Observable,
  BehaviorSubject,
  Subscription,
  debounceTime,
} from 'rxjs';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { NotificationState } from '../states/notification.state';
import { INotification } from '../models/notification.interface';
import { DatePipe } from '@angular/common';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { SetError } from '@features/error/states/error.action';
import { IError } from '@features/error/models/error.interface';
import * as NotificationActions from '../states/notification.action';

@Injectable()
export class NotificationFacade implements OnDestroy {
  newMessage$ = new BehaviorSubject<INotification | null>(null);
  messageListenSubs = new Subscription();
  constructor(
    private notificationService: NotificationService,
    private notificationState: NotificationState,
    private authfacade: AuthFacade
  ) {
    console.log('Notification Facade initialized');
    this.getUnreadCount();
    this.requestpermission();
    this.messageListenSubs = this.listenForMessages()
      .pipe(debounceTime(2000))
      .subscribe((message: any) => {
        if (message) {
          const payload = this.transformMessage(message);
          this.newMessage$.next(payload);
          this.newNotification(payload);
        }
      });
  }
  transformMessage(message: any): INotification {
    console.log(message);
    let message_time = null;
    let readable_time = null;
    if (message.data.timestamp != null) {
      console.log(new Date(Number(message.data.timestamp)));
      message_time = new Date(Number(message.data.timestamp));
      console.log(message_time);
      readable_time = new DatePipe('en-ZA').transform(
        message_time,
        'yyyy-MM-dd HH:mm:ss'
      );
    }
    return {
      id: message.messageId,
      is_read: message.data.is_read,
      timestamp: message.data.timestamp,
      timestamp_locale: readable_time,
      notification: {
        title: message.notification.title,
        body:
          message.notification.body === undefined
            ? ''
            : message.notification.body,
        image: message.notification.image,
      },
    };
  }

  getShowRequest() {
    return this.notificationService.showRequest;
  }
  getToken() {
    return this.notificationService.token$;
  }

  listenForMessages() {
    return this.notificationService.message$;
  }
  requestpermission() {
    this.notificationService.request();
  }
  @Dispatch()
  async getUnreadCount() {
    try {
      if (await this.authfacade.isLoggedIn()) {
        const count = await this.notificationService.getUnreadCount();
        console.log('count: ', count);
        return new NotificationActions.SetUnreadCount(count);
      }
      throw Error('User not logged in');
    } catch (error) {
      console.log(error);
      return new SetError('notification', error as IError);
    }
  }

  @Dispatch()
  async newNotification(message: INotification) {
    try {
      if (await this.authfacade.isLoggedIn()) {
        return new NotificationActions.NewNotification(message);
      }
      throw Error('User not logged in');
    } catch (error) {
      return new SetError('notification', error as IError);
    }
  }

  ngOnDestroy(): void {
    this.messageListenSubs.unsubscribe();
  }
}
