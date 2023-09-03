/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationFacade } from '../services/notification.facade';
import { ToastController } from '@ionic/angular';
import { INotification } from '../models/notification.interface';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  toast: HTMLIonToastElement | undefined;
  messages: any[] = [];
  isToastPresented = false;
  messageMaxLength = 200;
  newMessageSubs = new Subscription();
  constructor(
    private notificationFacade: NotificationFacade,
    private toastController: ToastController
  ) {
    this.newMessageSubs = this.notificationFacade.newMessage$.subscribe(
      (message: INotification | null) => {
        if (message !== null) {
          this.showMessage(message);
        }
      }
    );
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    /* uncomment below for testing notification ui*/
    // this.showMessage({
    //   notification: {
    //     title: 'Test message',
    //     body: 'long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message long test message',
    //     image:
    //       'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_640.jpg',
    //   },
    // });
    // setTimeout(() => {
    //   this.showMessage({
    //     notification: {
    //       title: 'First simulated message',
    //       body: 'First simulated body',
    //       image:
    //         'https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o=',
    //     },
    //   });
    // }, 1000);
    // setTimeout(() => {
    //   this.showMessage({
    //     notification: {
    //       title: 'Second simulated message',
    //       body: 'Second simulated body',
    //       image:
    //         'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80',
    //     },
    //   });
    // }, 4000);
  }

  async showMessage(message: any) {
    console.log(message);
    this.messages = [message];
    this.displayNextMessage();
  }

  async displayNextMessage() {
    if (this.messages.length > 0 && !this.isToastPresented) {
      this.isToastPresented = true;
      const message = this.messages.shift();
      this.toast = await this.toastController.create({
        // message: this.truncateMessage(message.notification.body),
        message: `<ion-avatar class="notification-avatar">
  <img alt="Silhouette of a person's head" src="${message.notification.image}" />
</ion-avatar>${message.notification.body}`,
        position: 'bottom',
        translucent: true,
        mode: 'ios',
        cssClass: 'custom-notification',
        buttons: [
          {
            side: 'end',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              this.toast?.dismiss();
            },
          },
        ],
      });
      this.toast.onDidDismiss().then(() => {
        this.isToastPresented = false;
        this.displayNextMessage();
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
}
