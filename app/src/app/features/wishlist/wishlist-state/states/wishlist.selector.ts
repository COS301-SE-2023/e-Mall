import { Selector } from '@ngxs/store';
import { WishlistState, WishlistStateModel } from './wishlist.state';

export class WishlistSelectors {
  @Selector([WishlistState])
  static getWishlist(state: WishlistStateModel) {
    return state.wishlist;
  }
}
