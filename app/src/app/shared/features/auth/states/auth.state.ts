import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { AuthService } from '../services/auth.service';
import { IUser } from '../models/user.interface';
import * as AuthActions from './auth.action';

export interface AuthStateModel {
  user: IUser | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
  },
})
@Injectable()
export class AuthState {
  constructor(private readonly authService: AuthService) {}
  @Action(AuthActions.SetCurrentUser)
  SetCurrentUser(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.SetCurrentUser
  ) {
    ctx.patchState({ user: action.user });
  }

  @Action(AuthActions.SignOutAction)
  signOut(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ user: null });
  }
}
