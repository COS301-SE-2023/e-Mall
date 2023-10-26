import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ISellerProfile } from '../models/seller-profile.interface';
import * as ProfileActions from './profile.actions';
import produce from 'immer';
import { Profile } from '../models/alias-profile.interface';
import { IProduct } from '@app/shared/models/product/product.interface';
import { ISellerCard } from '../models/seller-card.interface';

export interface ProfileStateModel {
  profile: Profile;
  recommended_products: IProduct[] | null;
  followed_sellers: ISellerCard[] | null;
}

@State<ProfileStateModel>({
  name: 'profile',
  defaults: {
    profile: null,
    recommended_products: null,
    followed_sellers: null,
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
    ctx.setState({
      profile: null,
      recommended_products: null,
      followed_sellers: null,
    });
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
          console.log(action.name);
          if (index === -1) {
            draft.profile.details.followed_sellers.push(action.name);
          } else {
            draft.profile.details.followed_sellers.splice(index, 1);
          }
        }
      })
    );
  }

  @Action(ProfileActions.UpdateFollowedSeller)
  updateFollowedSeller(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.UpdateFollowedSeller
  ) {
    ctx.setState(
      produce(draft => {
        // If draft.followed_seller is empty or null, just append
        if (!draft.followed_sellers || draft.followed_sellers.length === 0) {
          draft.followed_sellers = [action.sellers];
        } else {
          // If there are some items in draft.followed_sellers
          const index = draft.followed_sellers.findIndex(
            seller => seller.id === action.sellers.id
          );
          console.log(index);
          if (index === -1) {
            // If the action's parameter item doesn't already exist, append to list
            draft.followed_sellers.push(action.sellers);
          } else {
            // If it does exist, remove from the draft.followed_sellers list
            draft.followed_sellers.splice(index, 1);
          }
        }
      })
    );
  }
  @Action(ProfileActions.SetFollowedSeller)
  setFollowedSeller(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.SetFollowedSeller
  ) {
    ctx.setState(
      produce(draft => {
        draft.followed_sellers = action.sellers;
      })
    );
  }
}
