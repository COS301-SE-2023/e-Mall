import { Selector } from '@ngxs/store';
import { ComboState, ComboStateModel } from './combo.state';
import { ICombo } from '../models/combo.interface';

export class ComboSelectors{
  @Selector ([ComboState])
  static getCombos(state: ComboStateModel): ICombo[] | null {
    return state.combos;
  }
  @Selector ([ComboState])
  static getCombo(state: ComboStateModel, id: number): ICombo | null {
    return state.combos?.find((combo: { id: number; }) => combo.id === id) || null;
  }
}