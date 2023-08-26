import { ISellerProfile } from '../models/seller-profile.interface';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { IProduct } from '@shared/models/product/product.interface';

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

export class ToggleSellers {
  static readonly type = '[Profile] Updating Follwed Sellers';
  constructor(public name: string) {}
}

export class SetRecommendedProducts {
  static readonly type = '[Profile] Setting Recommended Products';
  constructor(public products: IProduct[]) {}
}