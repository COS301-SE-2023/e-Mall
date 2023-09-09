import { Component, Input } from '@angular/core';
import { INotification } from '@features/notification/models/notification.interface';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent {
  @Input() item!: INotification;
  @Input() calculatedTime!: string;
}
