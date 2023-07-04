import { Selector } from '@ngxs/store';
import { ErrorState, ErrorStateModel } from './error.state';
import { IError } from '../model/error.interface';

export class ErrorSelectors {
  @Selector([ErrorState])
  static getError(state: ErrorStateModel, key: string): IError | null {
    return state.errors[key];
  }
}
