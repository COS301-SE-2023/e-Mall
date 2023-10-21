import { Selector } from '@ngxs/store';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ISellerProfile } from '../models/seller-profile.interface';
import { ProfileState, ProfileStateModel } from './profile.state';
import { IProduct } from '@app/shared/models/product/product.interface';
import { ISellerCard } from '../models/seller-card.interface';

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
  // @Selector([ProfileState])
  // static getFollowedSellers(state: ProfileStateModel): string[] {
  //   return state.profile?.details.followed_sellers || [];
  // }
  @Selector([ProfileState])
  static getRecommendedProducts(state: ProfileStateModel): IProduct[] {
    return state.recommended_products || [];
  }
  @Selector([ProfileState])
  static getFollowedSellers(state: ProfileStateModel): ISellerCard[] {
    return state.followed_sellers || [];
  }
}
