import { State, Action, StateContext } from '@ngxs/store';
import { SetError, ClearError } from './error.action';
import { IError } from '../model/error.interface';
import { Injectable } from '@angular/core';

export interface ErrorStateModel {
  errors: { [key: string]: IError };
}

@State<ErrorStateModel>({
  name: 'error',
  defaults: {
    errors: {},
  },
})
@Injectable()
export class ErrorState {
  @Action(SetError)
  setError(ctx: StateContext<ErrorStateModel>, action: SetError) {
    const state = ctx.getState();
    ctx.patchState({
      errors: {
        ...state.errors,
        [action.key]: action.error,
      },
    });
  }

  @Action(ClearError)
  clearError(ctx: StateContext<ErrorStateModel>, action: ClearError) {
    const state = ctx.getState();
    const errors = { ...state.errors };
    delete errors[action.key];
    ctx.patchState({ errors });
  }
}
