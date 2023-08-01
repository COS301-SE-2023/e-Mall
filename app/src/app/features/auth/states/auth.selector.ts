import { Selector } from '@ngxs/store';
import { AuthState, AuthStateModel } from './auth.state';
import { IUser } from '../models/user.interface';

export class AuthSelectors {
  @Selector([AuthState])
  static currentUser(state: AuthStateModel): IUser | null {
    return state.user;
  }
}
