/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { INotification } from '@features/notification/models/notification.interface';
import { NotificationFacade } from '@features/notification/services/notification.facade';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDropdownComponent {
  notificationList$: Observable<INotification[] | null>;
  lastNotification$: Observable<string | null>;
  constructor(private notificationFacade: NotificationFacade) {
    console.log('Notification dropdown component initialized');
    this.notificationFacade.getNotifications();
    this.notificationList$ = notificationFacade.notificationList$;
    this.lastNotification$ = notificationFacade.lastNotification$;
  }
  onIonInfinite(event: any) {
    this.notificationFacade.getNotifications().then(() => {
      event.target.complete();
    });
  }
}
