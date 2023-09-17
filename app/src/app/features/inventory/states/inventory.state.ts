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
          //create an IInventoryItem
          const newProduct: IInventoryItem = {
            id: 0,
            original_price: action.data.original_price,
            price: action.data.price,
            discount: action.data.discount,
            discount_rate: action.data.discount_rate,
            product_url: action.data.product_url,
            in_stock: action.data.in_stock,
            img_array: action.data.img_array,
            product: action.data.product_name,
            seller: action.data.seller_name,
            product_name: action.data.product_name,
            product_category: '',
          };
          draft.products = [newProduct];
          draft.totalCount = 1;
        } else {
          let largest_id = 0;
          for (let i = 0; i < draft.products.length; i++) {
            if (draft.products[i].id > largest_id) {
              largest_id = draft.products[i].id;
            }
          }
          const newProduct: IInventoryItem = {
            id: largest_id + 1,
            original_price: action.data.original_price,
            price: action.data.price,
            discount: action.data.discount,
            discount_rate: action.data.discount_rate,
            product_url: action.data.product_url,
            in_stock: action.data.in_stock,
            img_array: action.data.img_array,
            product: action.data.product_name,
            seller: action.data.seller_name,
            product_name: action.data.product_name,
            product_category: '',
          };
          draft.products.unshift(newProduct);
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
          //create an IInventoryItem
          const newProduct: IInventoryItem = {
            id: 0,
            original_price: action.data.original_price,
            price: action.data.price,
            discount: action.data.discount,
            discount_rate: action.data.discount_rate,
            product_url: action.data.product_url,
            in_stock: action.data.in_stock,
            img_array: action.data.img_array,
            product: action.data.name,
            seller: action.data.seller_name,
            product_name: action.data.name,
            product_category: action.data.category,
          };
          draft.products = [newProduct];
          draft.totalCount = 1;
        } else {
          //find largest prod id
          let largest_id = 0;
          for (let i = 0; i < draft.products.length; i++) {
            if (draft.products[i].id > largest_id) {
              largest_id = draft.products[i].id;
            }
          }
          const newProduct: IInventoryItem = {
            id: largest_id + 1,
            original_price: action.data.original_price,
            price: action.data.price,
            discount: action.data.discount,
            discount_rate: action.data.discount_rate,
            product_url: action.data.product_url,
            in_stock: action.data.in_stock,
            img_array: action.data.img_array,
            product: action.data.name,
            seller: action.data.seller_name,
            product_name: action.data.name,
            product_category: action.data.category,
          };
          draft.products.unshift(newProduct);
          draft.totalCount++;
        }
      })
    );
  }
}
