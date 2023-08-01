import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { IUser } from '../models/user.interface';
import * as AuthActions from './auth.action';
import produce from 'immer';

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
  @Action(AuthActions.SetCurrentUser)
  SetCurrentUser(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.SetCurrentUser
  ) {
    ctx.setState({ user: action.user });
  }

  @Action(AuthActions.SignOutAction)
  signOut(ctx: StateContext<AuthStateModel>) {
    ctx.setState({ user: null });
  }
  @Action(AuthActions.UpdateToken)
  updateToken(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.UpdateToken
  ) {
    ctx.setState(
      produce(draft => {
        if (draft.user) draft.user.token = action.token;
      })
    );
  }
}
