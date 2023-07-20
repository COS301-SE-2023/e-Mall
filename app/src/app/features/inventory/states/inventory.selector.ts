import { Selector } from '@ngxs/store';
import { InventoryState, InventoryStateModel } from './inventory.state';

export class InventorySelectors {
  @Selector([InventoryState])
  static products(state: InventoryStateModel) {
    return state.products;
  }

  @Selector([InventoryState])
  static query(state: InventoryStateModel) {
    return state.query;
  }

  @Selector([InventoryState])
  static totalCount(state: InventoryStateModel) {
    return state.totalCount;
  }
  @Selector([InventoryState])
  static filter(state: InventoryStateModel) {
    return state.query.filterOptions;
  }
}
