import { Injectable } from '@angular/core';
import { Action, Actions, State, StateContext } from '@ngxs/store';
import { IComboResponse, ICombo } from '../models/combo.interface';
import * as ComboActions from './combo.actions';
import produce from 'immer';

export interface ComboStateModel {
  combos: IComboResponse[];
}

@State<ComboStateModel>({
  name: 'combos',
  defaults: {
    combos: [],
  },
})
@Injectable()
export class ComboState {
  @Actions(ComboActions.SetCombos)
  SetCombos(
    ctx: StateContext<ComboStateModel>,
    action: ComboActions.SetCombos
  ) {
    ctx.setState({ combos: action.combos });
  }
}
