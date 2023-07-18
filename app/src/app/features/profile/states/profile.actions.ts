import { ISellerProfile } from '../models/seller-profile.interface';
import { IConsumerProfile } from '../models/consumer-profile.interface';

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
