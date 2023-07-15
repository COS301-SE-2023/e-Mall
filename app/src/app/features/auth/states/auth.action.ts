import { IUser } from '../models/user.interface';

export class SetCurrentUser {
  static readonly type = '[Auth] Sign In Success';
  constructor(public user: IUser) {}
}

export class SignOutAction {
  static readonly type = '[Auth] Sign Out';
}
export class UpdateToken {
  static readonly type = '[Auth] Update Token';
  constructor(public token: string) {}
}
