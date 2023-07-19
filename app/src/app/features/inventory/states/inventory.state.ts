import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { ISearchOptions } from '../models/search-options.interface';
import { IInventoryItem } from '../models/inventory-item.interface';
import * as InventoryActions from '../states/inventory.action';
export interface InventoryStateModel {
  products: IInventoryItem[] | null;
  filters: ISearchOptions;
}

@State<InventoryStateModel>({
  name: 'inventory',
  defaults: {
    products: null,
    filters: {},
  },
})
@Injectable()
export class InventoryState {
  @Action(InventoryActions.SetInventory)
  setInventory(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.SetInventory
  ) {
    ctx.patchState({ products: action.products });
  }
  @Action(InventoryActions.AddItems)
  addItems(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.AddItems
  ) {
    const state = ctx.getState();
    const updatedProducts = state.products
      ? [...state.products, ...action.products]
      : action.products;
    ctx.patchState({ products: updatedProducts });
  }

  @Action(InventoryActions.DeleteItems)
  deleteItems(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.DeleteItems
  ) {
    const state = ctx.getState();
    if (state.products) {
      const updatedProducts = state.products.filter(
        product => !action.products.some(p => p.id === product.id)
      );
      ctx.patchState({ products: updatedProducts });
    }
  }
  @Action(InventoryActions.UpdateItem)
  updateItem(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.UpdateItem
  ) {
    const state = ctx.getState();
    if (state.products) {
      const updatedProducts = state.products.map(product =>
        product.id === action.product.id ? action.product : product
      );
      ctx.patchState({ products: updatedProducts });
    }
  }
  @Action(InventoryActions.UpdateItems)
  updateProducts(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.UpdateItems
  ) {
    const state = ctx.getState();
    if (state.products) {
      const updatedProducts = state.products.map(product => {
        const updatedProduct = action.products.find(p => p.id === product.id);
        return updatedProduct || product;
      });
      ctx.patchState({ products: updatedProducts });
    }
  }
  @Action(InventoryActions.SetFilter)
  setFilter(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.SetFilter
  ) {
    ctx.patchState({ filters: action.filterOptions });
  }

  @Action(InventoryActions.ResetFilter)
  resetFilter(ctx: StateContext<InventoryStateModel>) {
    ctx.patchState({ filters: {} });
  }

  @Action(InventoryActions.UpdateFilter)
  updateFilter(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.UpdateFilter
  ) {
    const state = ctx.getState();
    const updatedFilters = { ...state.filters, ...action.filterOptions };
    ctx.patchState({ filters: updatedFilters });
  }
}
