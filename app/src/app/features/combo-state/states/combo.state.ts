import { Inject, Injectable } from '@angular/core';
import { Action, Actions, State, StateContext } from '@ngxs/store';
import { ICombo, ICombo_invites } from '../models/combo.interface';
import * as ComboActions from './combo.actions';
import produce from 'immer';
import {
  SetCombos,
  InviteUsers,
  UpdateUsers,
  DeleteUser,
} from './combo.actions';
import { Observable, switchMap } from 'rxjs';
import { ComboService } from '../services/combo.service';
import { ComboFacade } from '../services/combo.facade';

export interface ComboStateModel {
  combos: ICombo[] | null;
  combo_invites: ICombo_invites[] | null;
}

@State<ComboStateModel>({
  name: 'combo',
  defaults: {
    combos: [],
    combo_invites: [],
  },
})
@Injectable()
export class ComboState {
  @Action(SetCombos)
  setCombos(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.SetCombos
  ) {
    ctx.setState({
      combos: action.payload.combos,
      combo_invites: action.payload.combo_invites,
    });
  }

  @Action(InviteUsers)
  inviteUsers(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.InviteUsers
  ) {
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (draft.combos) {
          for (const combo of draft.combos) {
            if (combo.id === action.payload.combo_id) {
              for (const email of action.payload.user_emails) {
                combo.pending_users.push(email);
              }
            }
          }
        }
      })
    );
  }

  @Action(ComboActions.RemoveProductFromCombo)
  RemoveProduct(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.RemoveProductFromCombo
  ) {
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (draft.combos) {
          for (const combo of draft.combos) {
            if (combo.id === Number(action.payload.combo_id)) {
              combo.products = combo.products.filter(
                product => product.id !== action.payload.product_id
              );
            }
          }
        }
      })
    );
  }

  @Action(ComboActions.AddProduct)
  AddProduct(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.AddProduct
  ) {
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (draft.combos) {
          for (const combo of draft.combos) {
            if (action.payload.combo_ids.includes(combo.id)) {
              //check if product already exists in combo
              const productIndex = combo.products.findIndex(
                product => product.id === action.payload.product.id
              );
              if (productIndex === -1) {
                combo.products.push(action.payload.product);
              }
            }
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
            combo => combo.id === action.payload.combo_id
          );
          if (draft.combo_invites) {
            draft.combo_invites = draft.combo_invites.filter(
              invite => invite.id !== action.payload.combo_id
            );
          }
          if (comboToUpdate) {
            if (action.payload.action === 'Accept') {
              // Update the active_usernames and pending_users arrays
              comboToUpdate.active_usernames.push(action.payload.user_email);
              //remove user from pending emails array
              comboToUpdate.pending_users = comboToUpdate.pending_users.filter(
                email => email !== action.payload.user_email
              );
            } else if (action.payload.action === 'Reject') {
              comboToUpdate.pending_users = comboToUpdate.pending_users.filter(
                email => email !== action.payload.user_email
              );
            }
          }
        }
      })
    );
  }

  @Action(DeleteUser)
  deleteUser(ctx: StateContext<ComboStateModel>, action: DeleteUser) {
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (!draft.combos) {
          return;
        }
        const comboIndex = draft.combos.findIndex(
          combo => combo.id === action.payload.combo_id
        );
        if (comboIndex !== -1) {
          //remove combo from combos array
          draft.combos.splice(comboIndex, 1);
        }
      })
    );
  }

  @Action(ComboActions.CreateCombo)
  CreateCombo(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.CreateCombo
  ) {
    const state = ctx.getState();
    const lastCombo =
      state.combos && state.combos.length > 0
        ? state.combos[state.combos.length - 1]
        : null;
    const newComboId = lastCombo ? lastCombo.id + 1 : 1;
    const newCombo = {
      id: newComboId,
      name: action.payload.combo_name,
      products: [action.payload.product],
      active_emails: [action.payload.current_user_email],
      active_usernames: action.payload.username,
      pending_users: action.payload.user_emails,
    };
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (draft.combos) {
          draft.combos.push(newCombo);
        }
      })
    );
  }

  @Action(ComboActions.EditCombo)
  EditCombo(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.EditCombo
  ) {
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (draft.combos) {
          for (const combo of draft.combos) {
            if (combo.id === action.payload.combo_id) {
              combo.name = action.payload.combo_name;
            }
          }
        }
      })
    );
  }
}
