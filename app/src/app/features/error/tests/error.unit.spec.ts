/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { ErrorState } from '../states/error.state';
import { SetError, ClearError } from '../states/error.action';
import { IError } from '../models/error.interface';
import { ErrorFacade } from '../services/error.facade';
import { of } from 'rxjs';

describe('ErrorModule', () => {
  let store: Store;
  let errorState: ErrorState;
  let errorFacade: ErrorFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Store,
        ErrorState,
        ErrorFacade,
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'),
            select: jasmine.createSpy('select'),
          },
        },
      ],
    });
    store = TestBed.inject(Store);
    errorState = TestBed.inject(ErrorState);
    errorFacade = TestBed.inject(ErrorFacade);
  });

  describe('ErrorState', () => {
    it('should set error', () => {
      const ctx = {
        getState: () => ({}),
        patchState: jasmine.createSpy('patchState'),
      };
      const action = new SetError('testKey', new IError(404, 'testMessage'));
      errorState.setError(ctx as any, action);
      expect(ctx.patchState).toHaveBeenCalledWith({
        errors: { testKey: new IError(404, 'testMessage') },
      });
    });

    it('should clear error', () => {
      const ctx = {
        getState: () => ({
          errors: { testKey: new IError(404, 'testMessage') },
        }),
        patchState: jasmine.createSpy('patchState'),
      };
      const action = new ClearError('testKey');
      errorState.clearError(ctx as any, action);
      expect(ctx.patchState).toHaveBeenCalledWith({ errors: {} });
    });
  });

  describe('ErrorFacade', () => {
    it('should get error', () => {
      (store.select as jasmine.Spy).and.returnValue(
        of(() => new IError(404, 'testMessage'))
      );
      errorFacade.getError$('testKey').subscribe(error => {
        expect(error).toEqual(new IError(404, 'testMessage'));
      });
    });

    it('should set error', () => {
      errorFacade.setError('testKey', new IError(404, 'testMessage'));
      expect(store.dispatch).toHaveBeenCalledWith(
        new SetError('testKey', new IError(404, 'testMessage'))
      );
    });

    it('should clear error', () => {
      errorFacade.clearError('testKey');
      expect(store.dispatch).toHaveBeenCalledWith(new ClearError('testKey'));
    });
  });
});
