/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationFacade } from '../services/notification.facade';
import { ToastController } from '@ionic/angular';
import { INotification } from '../models/notification.interface';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnDestroy {
  toast: HTMLIonToastElement | undefined;
  messages: any[] = [];
  isToastPresented = false;
  messageMaxLength = 200;
  newMessageSubs = new Subscription();
  isMenuOpened = false;
  menuOpenedSubs = new Subscription();

  constructor(
    public notificationFacade: NotificationFacade,
    private toastController: ToastController
  ) {
    this.menuOpenedSubs = notificationFacade.isMenuOpen$.subscribe(
      (val: boolean) => {
        this.isMenuOpened = val;
      }
    );

    this.newMessageSubs = this.notificationFacade.newMessage$.subscribe(
      (message: INotification | null) => {
        if (message !== null && !this.isMenuOpened) {
          this.showMessage(message);
        }
      }
    );
  }

  async showMessage(message: any) {
    this.messages = [message];
    this.displayNextMessage();
  }

  async displayNextMessage() {
    if (this.messages.length > 0 && !this.isToastPresented) {
      this.isToastPresented = true;
      const message = this.messages.shift();
      this.toast = await this.toastController.create({
        message: `${message.notification.body}`,
        position: 'top',
        translucent: true,
        header: message.notification.title,
        mode: 'ios',
        cssClass: 'custom-notification',
        // duration: 3000,
        layout: 'stacked',
        buttons: [
          {
            side: 'end',
            text: 'View',
            role: 'openPannel',
            handler: () => {
              this.openMenu(message);
            },
          },
          {
            side: 'end',
            text: 'Dismiss',
            role: 'cancel',
            handler: () => {
              this.toast?.dismiss();
            },
          },
        ],
      });
      this.toast.onDidDismiss().then(() => {
        this.isToastPresented = false;
        if (!this.isMenuOpened) this.displayNextMessage();
      });
      this.toast.present();
    }
  }

  truncateMessage(message: string) {
    if (message.length > this.messageMaxLength) {
      return message.slice(0, this.messageMaxLength) + '...';
    }
    return message;
  }
  ngOnDestroy(): void {
    this.newMessageSubs.unsubscribe();
  }

  async openMenu(message: INotification) {
    this.notificationFacade.isMenuOpen$.next(true);
    this.notificationFacade.notificationList$.subscribe(notificationList => {
      if (notificationList) {
        const foundItem = notificationList.find(item => item.id === message.id);
        if (foundItem) {
          this.notificationFacade.accordionOpen$.next(foundItem);
        } else {
          this.notificationFacade.accordionOpen$.next(undefined);
          console.log('Item not found to view');
        }
      }
    });
  }
}
