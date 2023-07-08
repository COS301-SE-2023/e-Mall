import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import * as ErrorActions from '../states/error.action';
import { ErrorSelectors } from '../states/error.selector';
import { Observable, map } from 'rxjs';
import { IError } from '../models/error.interface';

@Injectable()
export class ErrorFacade {
  constructor(private store: Store) {}
  getError$(key: string): Observable<IError | null> {
    return this.store.select(ErrorSelectors.getError).pipe(map(fn => fn(key)));
  }
  @Dispatch()
  setError(key: string, error: IError) {
    return new ErrorActions.SetError(key, error);
  }
  @Dispatch()
  clearError(key: string) {
    return new ErrorActions.ClearError(key);
  }
}
