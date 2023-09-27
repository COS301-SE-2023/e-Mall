/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe } from '@angular/common';
import { INotification } from '../models/notification.interface';
import { INotificationUser } from '../models/notification-user.interface';

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
    action: message.data.id,
    message_type: message.data.message_type,
    sender: message.data.sender,
    doc: message.data.doc,
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
export function transformNewMessage(message: any): INotification {
  let message_time = null;
  let readable_time = null;
  const data = message;
  console.log('data ', data);
  const timestamp = data.timestamp;
  console.log(timestamp);
  const unixTimestamp =
    timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
  let time_stamp_before_conversion = '';
  if (unixTimestamp != null) {
    if (isNaN(Number(unixTimestamp))) {
      message_time = new Date(unixTimestamp);
    } else {
      message_time = new Date(Number(unixTimestamp));
      time_stamp_before_conversion = message_time.toISOString();
    }
    readable_time = new DatePipe('en-ZA').transform(
      message_time,
      'yyyy-MM-dd HH:mm:ss'
    );
  }
  let is_read = false;
  if (typeof data.is_read === 'string') {
    const isReadString = data.is_read.toLowerCase();
    if (isReadString === 'true') {
      is_read = true;
    }
  } else if (data.is_read) {
    is_read = true;
  }
  const sender: INotificationUser = {
    id: data.sender.id,
    name: data.sender.name,
    image: data.sender.image,
  };
  const doc: INotificationUser = {
    id: data.doc.id,
    name: data.doc.name,
    image: data.doc.image,
  };
  const retData = {
    id: data.id,
    is_read: is_read,
    sender: sender,
    doc: doc,
    message_type: data.message_type,
    action: data.action,
    timestamp: time_stamp_before_conversion,
    timestamp_locale: readable_time,
    notification: {
      title: message.title,
      body: message.message === undefined ? '' : message.message,
      image: message.image === undefined ? '' : message.image,
    },
  };
  console.log(retData);
  return retData;
}
