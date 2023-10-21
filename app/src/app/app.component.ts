import { Component } from '@angular/core';
import { NotificationFacade } from './features/notification/services/notification.facade';
import { AuthFacade } from './features/auth/services/auth.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'e-Mall';
  constructor(
    public notificationFacade: NotificationFacade,
    public authFacade: AuthFacade
  ) {}
  notificationMenuClosed() {
    this.notificationFacade.isMenuOpen$.next(false);
  }
}
