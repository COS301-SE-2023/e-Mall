import { Selector } from '@ngxs/store';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ISellerProfile } from '../models/seller-profile.interface';
import { ProfileState, ProfileStateModel } from './profile.state';

export class ProfileSelectors {
  @Selector([ProfileState])
  static getProfile(
    state: ProfileStateModel
  ): ISellerProfile | IConsumerProfile | null {
    return state.profile;
  }
  @Selector([ProfileState])
  static getWishlist(state: ProfileStateModel): number[] {
    return state.profile?.details.wishlist || [];
  }
  @Selector([ProfileState])
  static getFollowedSellers(state: ProfileStateModel): string[] {
    return state.profile?.details.followed_sellers || [];
  }
}
