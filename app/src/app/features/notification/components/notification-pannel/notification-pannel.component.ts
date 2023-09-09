/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnDestroy, Input } from '@angular/core';
import { INotification } from '@features/notification/models/notification.interface';
import { NotificationFacade } from '@features/notification/services/notification.facade';
import { Observable, Subscription, take } from 'rxjs';
import {
  reactiveTimeFormat,
  timeFormat,
} from '@features/notification/utils/calculateTime';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-notification-pannel',
  templateUrl: './notification-pannel.component.html',
  styleUrls: ['./notification-pannel.component.scss'],
})
export class NotificationPannelComponent implements OnDestroy {
  @Input() menuId!: string;

  notificationList$: Observable<INotification[] | null>;
  lastNotification$: Observable<string | null>;
  opendAccordionNotification: any = undefined;
  isClosed: boolean = false;
  settings: boolean = false;
  constructor(
    public notificationFacade: NotificationFacade,
    private cdr: ChangeDetectorRef,
    private menuController: MenuController
  ) {
    console.log('Notification dropdown component initialized');

    this.notificationList$ = notificationFacade.notificationList$;
    // this.notificationList$.subscribe(() => this.cdr.markForCheck());
    this.lastNotification$ = notificationFacade.lastNotification$;
  }
  ngOnDestroy(): void {
    console.log('dropdown component destroyed');
  }

  onIonInfinite(event: any) {
    console.log('onIonInfinite event');
    this.notificationFacade.loadMoreNotifications().then(() => {
      event.target.complete();
    });
  }
  reactiveFormatTime(time: string | null) {
    if (time === null) return '';
    return reactiveTimeFormat(time);
  }
  formatTime(time: string | null) {
    if (time === null) return '';
    return timeFormat(time);
  }

  async read(item: INotification) {
    if (!item.is_read) this.notificationFacade.read(item.id);
    return;
  }
  onIonChange(event: any) {
    const currentNotification = event.detail.value;
    if (
      (currentNotification === undefined && this.opendAccordionNotification) ||
      (currentNotification &&
        this.opendAccordionNotification &&
        currentNotification != this.opendAccordionNotification)
    ) {
      this.read(this.opendAccordionNotification);
      this.opendAccordionNotification = undefined;
    }
    this.opendAccordionNotification = currentNotification;
  }

  async closeMenu() {
    // await this.menuController.  enable(true, this.menuId);
    this.notificationFacade.isMenuOpen$.next(false);
    // return await this.menuController.close(this.menuId);
  }
  async openSettings() {
    this.settings = true;
  }
  async back() {
    this.settings = false;
  }
}
