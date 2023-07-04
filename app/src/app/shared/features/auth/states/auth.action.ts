// import { ISellerForm } from '@app/models/seller/seller.interface';

import { IUser } from '../models/user.interface';

export class SetCurrentUser {
  static readonly type = '[Auth] Sign In Success';
  constructor(public user: IUser) {}
}

export class SignOutAction {
  static readonly type = '[Auth] Sign Out';
}
// export class SellerSignUpAction {
//   static readonly type = '[Auth] Seller Sign Up';
//   constructor(public sellerForm: ISellerForm) {}
// }
