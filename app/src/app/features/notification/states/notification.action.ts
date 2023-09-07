import { INotification } from '../models/notification.interface';

export class SetToken {
  static readonly type = '[Notification] Set Token';
  constructor(public token: string) {}
}

export class SignOutAction {
  static readonly type = '[Notification] Remove Token';
}
export class Update {
  static readonly type = '[Notification] Update Notifications';
  constructor(
    public notifications: INotification[],
    public has_next: boolean
  ) {}
}
export class NewNotification {
  static readonly type = '[Notification] New Notification received';
  constructor(public notification: INotification) {}
}

export class Read {
  static readonly type = '[Notification] Read Notification';
  constructor(public id: string) {}
}

export class SetUnreadCount {
  static readonly type = '[Notification] Set Unread Count';
  constructor(public count: number) {}
}

// Define the DeleteNotification action
export class Delete {
  static readonly type = '[Notification] Delete Notification';
  constructor(public id: string) {}
}
export class ResetNotifications {
  static readonly type = '[Notification] Reset Notifications';
}
