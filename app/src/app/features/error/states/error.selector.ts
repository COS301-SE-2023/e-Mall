import { Selector } from '@ngxs/store';
import { ErrorState, ErrorStateModel } from './error.state';
import { of } from 'rxjs';

export class ErrorSelectors {
  @Selector([ErrorState])
  static getError(state: ErrorStateModel) {
    return (key: string) => state.errors[key];
  }
}
