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
import { Observable, of, switchMap } from 'rxjs';
import { ComboService } from '../services/combo.service';
import { ComboFacade } from '../services/combo.facade';
import { ToastController } from '@ionic/angular';
import { ToastComponent } from '@app/shared/components/toast/toast.component';
import { IError } from '@app/features/error/models/error.interface';

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
  constructor(private toast: ToastComponent) {}
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
            if (combo.id === action.payload.collection_id) {
              for (const email of action.payload.Successful) {
                combo.pending_users.push(email);
              }
              if (action.payload.Unsuccessful.length > 0) {
                const error: IError = {
                  code: 400,
                  message: `The following emails do not exist in E-Mall: ${action.payload.Unsuccessful.join(
                    ', '
                  )}`,
                  name: 'Emails not found',
                };
                const errorObservable = of(error);
                this.toast.presentErrorToast(errorObservable);
              } else if (action.payload.Existing.length > 0) {
                const error: IError = {
                  code: 400,
                  message: `The following emails already exist in the collection: ${action.payload.Existing.join(
                    ', '
                  )}`,
                  name: 'Emails already exist',
                };
                const errorObservable = of(error);
                this.toast.presentErrorToast(errorObservable);
              } else {
                this.toast.presentSuccessToast('Invites sent successfully!');
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
            if (combo.id === Number(action.payload.collection_id)) {
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
            if (action.payload.collection_ids.includes(combo.id)) {
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
            combo => combo.id === action.payload.collection_id
          );
          if (draft.combo_invites) {
            draft.combo_invites = draft.combo_invites.filter(
              invite => invite.id !== action.payload.collection_id
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
          combo => combo.id === action.payload.collection_id
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
    const newCombo = {
      id: action.res.collection_id,
      name: action.data.combo_name,
      active_usernames: action.data.username,
      pending_users: action.res.Successful,
      products: [action.data.product],
      active_emails: [action.data.current_user_email],
    };
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (draft.combos) {
          draft.combos.push(newCombo);
        }
        if (action.res.Unsuccessful.length > 0) {
          const error: IError = {
            code: 400,
            message: `The following emails do not exist in E-Mall: ${action.res.Unsuccessful.join(
              ', '
            )}`,
            name: 'Emails not found',
          };
          const errorObservable = of(error);
          this.toast.presentErrorToast(errorObservable);
        } else {
          this.toast.presentSuccessToast('Collection created successfully!');
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
            if (combo.id === action.payload.collection_id) {
              combo.name = action.payload.combo_name;
            }
          }
        }
      })
    );
  }
}
