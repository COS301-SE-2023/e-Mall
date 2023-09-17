import { Component, Input } from '@angular/core';
import { INotification } from '@features/notification/models/notification.interface';
import { NotificationFacade } from '../../services/notification.facade';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent {
  @Input() item!: INotification;
  @Input() calculatedTime!: string;
  constructor(private notificationFacade: NotificationFacade) {}

  async delete(id: string) {
    this.notificationFacade.markReadInState(id);
    this.notificationFacade.delete(id);
  }
}
