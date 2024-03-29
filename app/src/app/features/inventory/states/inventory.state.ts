/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { ISearchOptions } from '../models/search-options.interface';
import { IInventoryItem } from '../models/inventory-item.interface';
import * as InventoryActions from '../states/inventory.action';
import produce from 'immer';
export interface InventoryStateModel {
  products: IInventoryItem[] | null;
  query: ISearchOptions;
  totalCount: number;
  newProducts: IInventoryItem[];
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
    newProducts: [],
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

  @Action(InventoryActions.DeleteItem)
  deleteItem(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.DeleteItem
  ) {
    const state = ctx.getState();
    if (state.products) {
      const products = [...state.products];
      const productIndex = products.findIndex(
        product => product.id === action.id
      );
      if (productIndex !== -1) {
        products.splice(productIndex, 1);
        ctx.patchState({
          products,
        });
      }
    }
  }
  @Action(InventoryActions.UpdateItems)
  updateItems(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.UpdateItems
  ) {
    ctx.setState(
      produce((draft: InventoryStateModel) => {
        action.products.forEach(updatedProduct => {
          if (draft.products !== null) {
            const productIndex = draft.products.findIndex(
              product => product.id === updatedProduct.id
            );
            if (productIndex !== -1) {
              if (updatedProduct !== null) {
                draft.products[productIndex].discount =
                  updatedProduct.original_price! *
                  updatedProduct.discount_rate!;
                draft.products[productIndex].price =
                  updatedProduct.original_price! -
                  draft.products[productIndex].discount!;
              }
              draft.products[productIndex] = {
                ...draft.products[productIndex],
                ...updatedProduct,
              };
            }
          }
        });
      })
    );
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
      newProducts: [],
    });
  }
  @Action(InventoryActions.AddExistingProduct)
  addExistingProduct(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.AddExistingProduct
  ) {
    ctx.setState(
      produce((draft: InventoryStateModel) => {
        if (draft.products === null) {
          draft.products = [action.IInventoryItem];
          draft.totalCount = 1;
        } else {
          draft.products.unshift(action.IInventoryItem);
          draft.totalCount++;
        }
      })
    );
  }

  @Action(InventoryActions.AddNewProduct)
  addNewProduct(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.AddNewProduct
  ) {
    ctx.setState(
      produce((draft: InventoryStateModel) => {
        if (draft.products === null) {
          draft.products = [action.IInventoryItem];
          draft.totalCount = 1;
        } else {
          draft.products.unshift(action.IInventoryItem);
          draft.totalCount++;
        }
      })
    );
  }

  @Action(InventoryActions.AddNewProducts)
  addNewProducts(
    ctx: StateContext<InventoryStateModel>,
    action: InventoryActions.AddNewProducts
  ) {
    ctx.setState(
      produce((draft: InventoryStateModel) => {
        if (draft.products?.length === 0) {
          draft.products = [...action.newProducts];
          draft.totalCount = action.newProducts.length;
        } else {
          draft.products?.push(...action.newProducts);
          draft.totalCount += action.newProducts.length;
        }
      })
    );
  }
}
