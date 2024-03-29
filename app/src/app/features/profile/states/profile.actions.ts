import { ISellerProfile } from '../models/seller-profile.interface';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { IProduct } from '@shared/models/product/product.interface';
import { ISellerCard } from '../models/seller-card.interface';

export class SetProfile {
  static readonly type = '[Profile] Set Profile';
  constructor(public profile: ISellerProfile | IConsumerProfile) {}
}

export class UpdateProfile {
  static readonly type = '[Profile] Update Profile';
  constructor(
    public payload: { profile: Partial<IConsumerProfile | ISellerProfile> }
  ) {}
}

export class ClearProfile {
  static readonly type = '[Profile] Clear Profile';
}

export class ToggleWishlist {
  static readonly type = '[Profile] Updating Wishlist';
  constructor(public id: number) {}
}

export class RemoveProductFromWishlist {
  static readonly type = '[Profile] Removing Product From Wishlist';
  constructor(public id: number) {}
}

export class ToggleSellers {
  static readonly type = '[Profile] Updating Follwed Sellers';
  constructor(public name: string) {}
}

export class SetRecommendedProducts {
  static readonly type = '[Profile] Setting Recommended Products';
  constructor(public products: IProduct[]) {}
}
export class UpdateFollowedSeller {
  static readonly type = '[Profile] Update Following Sellers';
  constructor(public sellers: ISellerCard) {}
}
export class SetFollowedSeller {
  static readonly type = '[Profile] Set Following Sellers';
  constructor(public sellers: ISellerCard[] | null) {}
}
