import { Component } from '@angular/core';
import { NotificationFacade } from './features/notification/services/notification.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app';
  constructor(public notificationFacade: NotificationFacade) {}
  notificationMenuClosed() {
    this.notificationFacade.isMenuOpen$.next(false);
  }
}
