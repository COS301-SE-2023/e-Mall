import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ISellerProfile } from '../models/seller-profile.interface';
import * as ProfileActions from './profile.actions';
import produce from 'immer';
import { Profile } from '../models/alias-profile.interface';
import { IProduct } from '@app/shared/models/product/product.interface';

export interface ProfileStateModel {
  profile: Profile;
  recommended_products: IProduct[] | null;
}

@State<ProfileStateModel>({
  name: 'profile',
  defaults: {
    profile: null,
    recommended_products: null,
  },
})
@Injectable()
export class ProfileState {
  @Action(ProfileActions.SetProfile)
  SetProfile(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.SetProfile
  ) {
    ctx.setState(
      produce(draft => {
        if (draft.profile) {
          Object.assign(draft.profile, action.profile);
        } else {
          draft.profile = action.profile as unknown as
            | IConsumerProfile
            | ISellerProfile;
        }
      })
    );
  }

  @Action(ProfileActions.UpdateProfile)
  UpdateProfile(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.UpdateProfile
  ) {
    ctx.setState(
      produce(draft => {
        if (draft.profile) {
          Object.assign(draft.profile, action.payload.profile);
        } else {
          draft.profile = action.payload.profile as unknown as
            | IConsumerProfile
            | ISellerProfile;
        }
      })
    );
  }
  @Action(ProfileActions.ClearProfile)
  signOut(ctx: StateContext<ProfileStateModel>) {
    ctx.setState({ profile: null, recommended_products: null });
  }

  // @Action(ProfileActions.AddToWishlist)
  // addToWishlist(
  //   ctx: StateContext<ProfileStateModel>,
  //   action: ProfileActions.AddToWishlist
  // ) {
  //   ctx.setState(
  //     produce(draft => {
  //       if (draft.profile) {
  //         draft.profile.details.wishlist.push(action.id);
  //       }
  //     })
  //   );
  // }

  // @Action(ProfileActions.RemoveFromWishlist)
  // removeFromWishlist(
  //   ctx: StateContext<ProfileStateModel>,
  //   action: ProfileActions.RemoveFromWishlist
  // ) {
  //   ctx.setState(
  //     produce(draft => {
  //       if (draft.profile) {
  //         draft.profile.details.wishlist.splice(
  //           draft.profile.details.wishlist.indexOf(action.id),
  //           1
  //         );
  //       }
  //     })
  //   );
  // }
  // @Action(ProfileActions.AddToFollowedSellers)
  // addToFollowedSellers(
  //   ctx: StateContext<ProfileStateModel>,
  //   action: ProfileActions.AddToFollowedSellers
  // ) {
  //   ctx.setState(
  //     produce(draft => {
  //       if (draft.profile) {
  //         draft.profile.details.followed_sellers.push(action.name);
  //       }
  //     })
  //   );
  // }

  // @Action(ProfileActions.RemoveFromFollowedSellers)
  // removeFromFollowedSellers(
  //   ctx: StateContext<ProfileStateModel>,
  //   action: ProfileActions.RemoveFromFollowedSellers
  // ) {
  //   ctx.setState(
  //     produce(draft => {
  //       if (draft.profile) {
  //         draft.profile.details.followed_sellers.splice(
  //           draft.profile.details.followed_sellers.indexOf(action.name),
  //           1
  //         );
  //       }
  //     })
  //   );
  // }

  @Action(ProfileActions.ToggleWishlist)
  toggleWishlist(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.ToggleWishlist
  ) {
    ctx.setState(
      produce(draft => {
        if (draft.profile) {
          const index = draft.profile.details.wishlist.indexOf(action.id);
          if (index === -1) {
            draft.profile.details.wishlist.push(action.id);
          }
        }
      })
    );
  }

  @Action(ProfileActions.RemoveProductFromWishlist)
  removeProductFromWishlist(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.RemoveProductFromWishlist
  ) {
    ctx.setState(
      produce(draft => {
        if (draft.profile) {
          draft.profile.details.wishlist.splice(
            draft.profile.details.wishlist.indexOf(action.id),
            1
          );
        }
      })
    );
  }

  @Action(ProfileActions.ToggleSellers)
  toggleSellers(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.ToggleSellers
  ) {
    ctx.setState(
      produce(draft => {
        if (draft.profile) {
          const index = draft.profile.details.followed_sellers.indexOf(
            action.name
          );
          if (index === -1) {
            draft.profile.details.followed_sellers.push(action.name);
          } else {
            draft.profile.details.followed_sellers.splice(index, 1);
          }
        }
      })
    );
  }

  @Action(ProfileActions.SetRecommendedProducts)
  setRecommendedProducts(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.SetRecommendedProducts
  ) {
    ctx.setState(
      produce(draft => {
        draft.recommended_products = action.products;
      })
    );
  }
}
