/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnDestroy, Input } from '@angular/core';
import { INotification } from '@features/notification/models/notification.interface';
import { NotificationFacade } from '@features/notification/services/notification.facade';
import { Observable, Subscription } from 'rxjs';
import {
  reactiveTimeFormat,
  timeFormat,
} from '@features/notification/utils/calculateTime';
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
  menuOpenedSubs = new Subscription();
  selectedItemSubs = new Subscription();
  settings = false;
  selectedItem: INotification | undefined;
  constructor(
    public notificationFacade: NotificationFacade,
    private cdr: ChangeDetectorRef
  ) {
    this.menuOpenedSubs = notificationFacade.isMenuOpen$.subscribe(
      (val: boolean) => {
        if (!val && this.opendAccordionNotification) {
          this.readPrevClicked();
        }
      }
    );
    this.selectedItemSubs = notificationFacade.accordionOpen$.subscribe(val => {
      if (val) {
        this.opendAccordionNotification = val;
        this.cdr.markForCheck();
      }
    });
    this.notificationList$ = notificationFacade.notificationList$;
    this.lastNotification$ = notificationFacade.lastNotification$;
  }
  ngOnDestroy(): void {
    this.menuOpenedSubs.unsubscribe();
    this.selectedItemSubs.unsubscribe();
  }

  onIonInfinite(event: any) {
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
  }
  onIonChange(event: any) {
    const currentNotification = event.detail.value;
    if (
      (currentNotification === undefined && this.opendAccordionNotification) ||
      (currentNotification &&
        this.opendAccordionNotification &&
        currentNotification != this.opendAccordionNotification)
    ) {
      this.readPrevClicked();
    }
    this.opendAccordionNotification = currentNotification;
    this.notificationFacade.accordionOpen$.next(currentNotification);
  }

  async closeMenu() {
    if (this.opendAccordionNotification) {
      this.readPrevClicked();
    }
    this.notificationFacade.isMenuOpen$.next(false);
  }
  async openSettings() {
    this.settings = true;
  }
  async back() {
    this.settings = false;
  }
  async readAll() {
    await this.notificationFacade.readAll();
  }
  async deleteAll() {
    if (this.opendAccordionNotification !== undefined) {
      this.notificationFacade.markReadInState(
        this.opendAccordionNotification.id
      );
    }
    await this.notificationFacade.deleteAll();
    this.cdr.markForCheck();
  }
  readPrevClicked() {
    this.read(this.opendAccordionNotification);
    this.opendAccordionNotification = undefined;
  }
  async refresh() {
    await this.notificationFacade.refresh();
  }
}
