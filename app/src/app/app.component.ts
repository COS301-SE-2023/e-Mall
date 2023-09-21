import { Component, OnInit } from '@angular/core';
import { NotificationFacade } from './features/notification/services/notification.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'e-Mall';
  showSplash = true;
  constructor(public notificationFacade: NotificationFacade) {}
  notificationMenuClosed() {
    this.notificationFacade.isMenuOpen$.next(false);
  }
  ngOnInit() {
    console.log('splashhh', this.showSplash);
    setTimeout(() => {
      this.showSplash = false;
    }, 5000);
  }
}
