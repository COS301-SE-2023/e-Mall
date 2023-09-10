/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe } from '@angular/common';
import { INotification } from '../models/notification.interface';

export function transformMessage(message: any): INotification {
  let message_time = null;
  let readable_time = null;
  if (message.data.timestamp != null) {
    if (isNaN(Number(message.data.timestamp))) {
      message_time = new Date(message.data.timestamp);
    } else {
      message_time = new Date(Number(message.data.timestamp));
      message.data.timestamp = message_time.toISOString();
    }
    readable_time = new DatePipe('en-ZA').transform(
      message_time,
      'yyyy-MM-dd HH:mm:ss'
    );
  }
  let is_read = false;
  if (typeof message.data.is_read === 'string') {
    const isReadString = message.data.is_read.toLowerCase();
    if (isReadString === 'true') {
      is_read = true;
    }
  } else if (message.data.is_read) {
    is_read = true;
  }
  return {
    id: message.data.id,
    is_read: is_read,
    timestamp: message.data.timestamp,
    timestamp_locale: readable_time,
    notification: {
      title: message.notification.title,
      body:
        message.notification.body === undefined
          ? ''
          : message.notification.body,
      image: message.notification.image,
    },
  };
}