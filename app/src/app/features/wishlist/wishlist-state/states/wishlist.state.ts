import { Inject, Injectable } from '@angular/core';
import { Action, Actions, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import * as WishlistActions from './wishlist.actions';
import { IProduct } from '@app/shared/models/product/product.interface';

export interface WishlistStateModel {
  wishlist: IProduct[] | null;
}

@State<WishlistStateModel>({
  name: 'wishlist',
  defaults: {
    wishlist: [],
  },
})
@Injectable()
export class WishlistState {
  @Action(WishlistActions.SetWishlist)
  setWishlist(
    ctx: StateContext<WishlistStateModel>,
    action: WishlistActions.SetWishlist
  ) {
    ctx.setState({ wishlist: action.products });
  }

  @Action(WishlistActions.AddProductToWishlist)
  addProductToWishlist(
    ctx: StateContext<WishlistStateModel>,
    action: WishlistActions.AddProductToWishlist
  ) {
    ctx.setState(
      produce((draft: WishlistStateModel) => {
        if (draft.wishlist) {
          const index = draft.wishlist.findIndex(
            product => product.id === action.product.id
          );
          if (index === -1) {
            draft.wishlist.push(action.product);
          }
        }
      })
    );
  }

  @Action(WishlistActions.RemoveProductFromWishlist)
  removeProductFromWishlist(
    ctx: StateContext<WishlistStateModel>,
    action: WishlistActions.RemoveProductFromWishlist
  ) {
    ctx.setState(
      produce((draft: WishlistStateModel) => {
        if (draft.wishlist) {
          const index = draft.wishlist.findIndex(
            product => product.id === action.product.id
          );
          if (index !== -1) {
            draft.wishlist.splice(index, 1);
          }
        }
      })
    );
  }
}
