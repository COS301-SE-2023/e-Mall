/* eslint-disable @typescript-eslint/no-explicit-any */
export interface INotification {
  id: string;
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
