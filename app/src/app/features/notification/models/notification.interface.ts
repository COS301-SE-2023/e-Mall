import { INotificationUser } from './notification-user.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface INotification {
  id: string;
  sender: INotificationUser;
  doc: INotificationUser;
  message_type: string;
  action: string;
  notification: {
    title?: string;
    body: string;
    image?: string;
  };
  link?: string;
  timestamp: string | null;
  timestamp_locale: string | null;
  is_read: boolean;
}
