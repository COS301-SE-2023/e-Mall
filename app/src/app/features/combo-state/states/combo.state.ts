import { Injectable } from '@angular/core';
import { Action, Actions, State, StateContext } from '@ngxs/store';
import {  ICombo } from '../models/combo.interface';
import * as ComboActions from './combo.actions';
import produce from 'immer';
import {
  SetCombos,
  UpdateCombo,
  UpdateUsers,
  DeleteUser,
} from './combo.actions';

export interface ComboStateModel {
  combos: ICombo[] | null;
}

@State<ComboStateModel>({
  name: 'combo',
  defaults: {
    combos: null,
  },
})

@Injectable()
export class ComboState {
  @Action(SetCombos)
  setCombos(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.SetCombos
  ) {
    ctx.setState({ combos: action.combos });
  }

  @Action(UpdateCombo)
  updateCombo(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.UpdateCombo
  ) {
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (draft.combos) {
          const comboToUpdate = draft.combos.find(
            combo => combo.id === action.payload.combo.id
          );
          if (comboToUpdate) {
            // Merge the changes from the payload into the existing combo
            Object.assign(comboToUpdate, action.payload.combo);
          }
        }
      })
    );
  }

  @Action(UpdateUsers)
  updateUsers(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.UpdateUsers
  ) {
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (draft.combos) {
          const comboToUpdate = draft.combos.find(
            combo => combo.id === action.payload.combo.id
          );
          if (comboToUpdate) {
            // Update the active_usernames and pending_users arrays
            comboToUpdate.active_usernames =
              action.payload.combo.active_usernames ||
              comboToUpdate.active_usernames;
            comboToUpdate.pending_users =
              action.payload.combo.pending_users || comboToUpdate.pending_users;
          }
        }
      })
    );
  }

  //   @Action(DeleteUser)
  //   deleteUser(ctx: StateContext<ComboStateModel>, action: DeleteUser) {
  //     ctx.setState(
  //       produce((draft: ComboStateModel) => {
  //         if (!draft.combos) {
  //           return;
  //         }
  //         const comboIndex = draft.combos.findIndex(
  //           combo => combo.id === action.comboId
  //         );
  //         if (comboIndex !== -1) {
  //           const combo = draft.combos[comboIndex];
  //           if (
  //             combo.user_emails.length === 1 &&
  //             combo.user_emails[0] === action.username
  //           ) {
  //             draft.combos.splice(comboIndex, 1); // Remove combo entirely
  //           } else if (combo.user_emails.includes(action.username)) {
  //             combo.user_emails = combo.user_emails.filter(
  //               email => email !== action.username
  //             );
  //           }
  //         }
  //       })
  //     );
  //   }
}