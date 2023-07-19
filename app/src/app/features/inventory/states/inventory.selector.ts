import { Selector } from '@ngxs/store';
import { InventoryState, InventoryStateModel } from './inventory.state';

export class InventorySelectors {
  @Selector([InventoryState])
  static products(state: InventoryStateModel) {
    return state.products;
  }

  @Selector([InventoryState])
  static filters(state: InventoryStateModel) {
    return state.filters;
  }
}
