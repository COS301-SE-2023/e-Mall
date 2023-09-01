/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { EMPTY, Observable } from 'rxjs';

@Injectable()
export class NotificationFacade {
  constructor(private notificationService: NotificationService) {
    console.log('Notification Facade initialized');
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

  requestPermission() {
    this.notificationService.request();
  }
}
