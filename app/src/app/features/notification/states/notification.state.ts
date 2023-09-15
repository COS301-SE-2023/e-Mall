import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { INotification } from '../models/notification.interface';
import * as NotificationActions from './notification.action';
import produce from 'immer';

export interface NotificationStateModel {
  token: string | null;
  notifications: INotification[] | null;
  has_next: boolean;
  count: number;
  last_notification: string | null;
  unread_count: number;
}

@State<NotificationStateModel>({
  name: 'notification',
  defaults: {
    token: null,
    notifications: null,
    has_next: false,
    last_notification: null,
    count: 0,
    unread_count: 0,
  },
})
@Injectable()
export class NotificationState {
  @Action(NotificationActions.SetToken)
  SetToken(
    ctx: StateContext<NotificationStateModel>,
    action: NotificationActions.SetToken
  ) {
    ctx.setState({
      token: action.token,
      notifications: null,
      has_next: false,
      last_notification: null,
      count: 0,
      unread_count: 0,
    });
  }

  @Action(NotificationActions.SignOutAction)
  signOut(ctx: StateContext<NotificationStateModel>) {
    ctx.setState({
      token: null,
      notifications: null,
      has_next: false,
      last_notification: null,
      count: 0,
      unread_count: 0,
    });
  }
  @Action(NotificationActions.Update)
  update(
    ctx: StateContext<NotificationStateModel>,
    action: NotificationActions.Update
  ) {
    if (action.notifications != null) {
      ctx.setState(
        produce(draft => {
          if (draft.notifications) {
            draft.notifications.push(...action.notifications);
          } else {
            draft.notifications = action.notifications;
          }
          draft.has_next = action.has_next;
          draft.count = draft.notifications.length;
          if (draft.notifications.length > 0) {
            draft.last_notification =
              action.notifications[action.notifications.length - 1].id;
          }
        })
      );
    }
  }
  @Action(NotificationActions.NewNotification)
  newNotification(
    ctx: StateContext<NotificationStateModel>,
    action: NotificationActions.NewNotification
  ) {
    if (action.notification != null) {
      ctx.setState(
        produce(draft => {
          if (draft.notifications === null) {
            if (action.isInitial) {
              draft.notifications = [action.notification];
              draft.count = 1;
              draft.last_notification = action.notification.id;
            }
          } else {
            draft.notifications.unshift(action.notification);
            draft.count = draft.notifications.length;
          }
          draft.unread_count = draft.unread_count + 1;
        })
      );
    }
  }

  // Define the state functions for the ReadNotification and Delete actions
  @Action(NotificationActions.Read)
  read(
    ctx: StateContext<NotificationStateModel>,
    action: NotificationActions.Read
  ) {
    ctx.setState(
      produce(draft => {
        // Find the notification with the given ID and update its is_read field
        if (draft.notifications != null) {
          const notification = draft.notifications.find(
            n => n.id === action.id
          );
          if (notification) {
            notification.is_read = true;
            draft.unread_count = draft.unread_count - 1;
          }
        }
      })
    );
  }
  @Action(NotificationActions.SetUnreadCount)
  setUnreadCount(
    ctx: StateContext<NotificationStateModel>,
    action: NotificationActions.SetUnreadCount
  ) {
    ctx.setState(
      produce(draft => {
        draft.unread_count = action.count;
      })
    );
  }
  @Action(NotificationActions.ResetNotifications)
  resetNotifications(ctx: StateContext<NotificationStateModel>) {
    ctx.setState(
      produce(draft => {
        draft.has_next = false;
        draft.notifications = null;
        draft.last_notification = null;
      })
    );
  }

  @Action(NotificationActions.Delete)
  delete(
    ctx: StateContext<NotificationStateModel>,
    action: NotificationActions.Delete
  ) {
    ctx.setState(
      produce(draft => {
        // Find the index of the notification with the given ID and remove it from the notifications list
        if (draft.notifications != null) {
          const index = draft.notifications.findIndex(n => n.id === action.id);
          if (index !== -1) {
            if (draft.notifications[index].is_read === false) {
              draft.unread_count -= 1;
            }

            draft.notifications.splice(index, 1);
            draft.count -= 1;

            if (draft.notifications.length === 0) {
              draft.notifications = null;
              draft.count = 0;
              draft.unread_count = 0;
              draft.last_notification = null;
            } else {
              draft.last_notification =
                draft.notifications[draft.notifications.length - 1].id;
            }
          }
        }
      })
    );
  }
  @Action(NotificationActions.DeleteAll)
  deleteAll(ctx: StateContext<NotificationStateModel>) {
    ctx.setState(
      produce(draft => {
        draft.has_next = false;
        draft.notifications = [];
        draft.last_notification = null;
        draft.unread_count = 0;
      })
    );
  }
  @Action(NotificationActions.ReadAll)
  readAll(ctx: StateContext<NotificationStateModel>) {
    ctx.setState(
      produce(draft => {
        if (draft.notifications !== null) {
          draft.notifications.forEach(notification => {
            if (!notification.is_read) {
              notification.is_read = true;
            }
          });
          draft.unread_count = 0;
        }
      })
    );
  }
}
