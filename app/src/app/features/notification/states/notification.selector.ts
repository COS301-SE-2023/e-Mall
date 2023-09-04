import { Selector } from '@ngxs/store';
import {
  NotificationState,
  NotificationStateModel,
} from './notification.state';
import { INotification } from '../models/notification.interface';

export class NotificationSelectors {
  @Selector([NotificationState])
  static getToken(state: NotificationStateModel): string | null {
    return state.token;
  }
  @Selector([NotificationState])
  static getNotifications(
    state: NotificationStateModel
  ): INotification[] | null {
    return state.notifications;
  }
  @Selector([NotificationState])
  static getLastNotification(state: NotificationStateModel): string | null {
    return state.token;
  }
  @Selector([NotificationState])
  static getCount(state: NotificationStateModel): number {
    return state.count;
  }
}
