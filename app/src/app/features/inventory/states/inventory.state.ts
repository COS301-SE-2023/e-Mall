import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { ISearchOptions } from '../models/search-options.interface';
import { IInventoryItem } from '../models/inventory-item.interface';
import * as InventoryActions from '../states/inventory.action';
import produce from 'immer';
import { ResetInventoryState } from './inventory.action';
export interface InventoryStateModel {
  products: IInventoryItem[] | null;
  query: ISearchOptions;
  totalCount: number;
}

@State<InventoryStateModel>({
  name: 'inventory',
  defaults: {
    products: null,
    query: {
      search: '',
      searchOption: 'name',
      sortOption: 'name',
      filterOptions: {
        filter_in_stock: 'all',
      },
      page: 0,
      per_page: 10,
    },
    totalCount: 0,
  },
})
@Injectable()
export class InventoryState {
  @Action(InventoryActions.SetInventory)
  setInventory(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.SetInventory
  ) {
    ctx.patchState({
      products: action.products,
      totalCount: action.totalCount,
    });
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
  @Action(InventoryActions.SetQuery)
  setQuery(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.SetQuery
  ) {
    ctx.patchState({ query: action.query });
  }

  @Action(InventoryActions.ResetQuery)
  resetQuery(ctx: StateContext<InventoryStateModel>) {
    ctx.patchState({ query: {} });
  }

  @Action(InventoryActions.UpdateQuery)
  updateQuery(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.UpdateQuery
  ) {
    ctx.setState(
      produce((draft: InventoryStateModel) => {
        draft.query = {
          ...draft.query,
          ...action.query,
        };
      })
    );
  }
  @Action(InventoryActions.UpdateFilterOptions)
  updateFilterOptions(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.UpdateFilterOptions
  ) {
    // Get the current state
    ctx.setState(
      produce((draft: InventoryStateModel) => {
        // Update the filterOptions field of the query object
        draft.query.filterOptions = {
          ...draft.query.filterOptions,
          ...action.filterOptions,
        };
      })
    );
  }
  @Action(InventoryActions.ResetInventoryState)
  resetInventoryState(ctx: StateContext<InventoryStateModel>) {
    ctx.setState({
      products: null,
      query: {
        search: '',
        searchOption: 'name',
        sortOption: 'name',
        filterOptions: {
          filter_in_stock: 'all',
        },
        page: 0,
        per_page: 10,
      },
      totalCount: 0,
    });
  }
}
