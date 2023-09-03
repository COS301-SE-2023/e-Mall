import { Inject, Injectable } from '@angular/core';
import { Action, Actions, State, StateContext } from '@ngxs/store';
import { ICombo } from '../models/combo.interface';
import * as ComboActions from './combo.actions';
import produce from 'immer';
import {
  SetCombos,
  UpdateCombo,
  UpdateUsers,
  DeleteUser,
} from './combo.actions';
import { Observable, switchMap } from 'rxjs';
import { ComboService } from '../services/combo.service';
import { ComboFacade } from '../services/combo.facade';

export interface ComboStateModel {
  combos: ICombo[] | null;
}

@State<ComboStateModel>({
  name: 'combo',
  defaults: {
    combos: [],
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
          for (const combo of draft.combos) {
            for (const id of action.payload.combo_ids)
              if (combo.id === Number(id)) {
                //check if the product is already in the combo and if so , remove , else push
                if (
                  combo.products.find(
                    product => product.id === action.payload.product.id
                  )
                ) {
                  combo.products = combo.products.filter(
                    product => product.id !== action.payload.product.id
                  );
                } else combo.products.push(action.payload.product);
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
      products: action.payload.product_ids.map(
        (id: number) => action.payload.product
      ),
      active_emails: action.payload.user_emails.slice(0, 1),
      active_usernames: action.payload.username,
      pending_users: action.payload.user_emails.slice(1),
    };
    ctx.setState(
      produce((draft: ComboStateModel) => {
        if (draft.combos) {
          draft.combos.push(newCombo);
        }
      })
    );
  }
}
