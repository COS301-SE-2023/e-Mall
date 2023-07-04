import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import * as ErrorActions from '../states/error.action';
import { ErrorSelectors } from '../states/error.selector';
import { Observable } from 'rxjs';
import { IError } from '../models/error.interface';

@Injectable()
export class ErrorFacade {
  @Select(ErrorSelectors.getError)
  error$!: Observable<IError>;

  @Dispatch()
  setError(key: string, error: IError) {
    return new ErrorActions.SetError(key, error);
  }
  @Dispatch()
  clearError(key: string) {
    return new ErrorActions.ClearError(key);
  }
}
