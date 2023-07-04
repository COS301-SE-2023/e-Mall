import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthService } from '../service/auth.service';
import { IUser } from '../model/user.interface';
import * as AuthActions from './auth.action';
import { Navigate } from '@ngxs/router-plugin';

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
