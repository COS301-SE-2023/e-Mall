/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { AuthFacade } from '../services/auth.facade';
import { AuthService } from '../services/auth.service';
import { AuthState } from '../states/auth.state';
import * as AuthActions from '../states/auth.action';
import { IUser } from '../models/user.interface';

describe('AuthFacade and AuthService test', () => {
  let facade: AuthFacade;
  let authService: jasmine.SpyObj<AuthService>;
  let store: Store;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'signIn',
      'signUp',
      'signOut',
    ]);
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AuthState])],
      providers: [
        AuthFacade,
        {
          provide: AuthService,
          useValue: authServiceSpy,
        },
      ],
    });
    facade = TestBed.inject(AuthFacade);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    store = TestBed.inject(Store);
  });

  it('should sign in a user', async () => {
    const email = 'test@example.com';
    const password = 'testpassword';
    const user: IUser = {
      email,
      token: 'testtoken',
      type: 'testtype',
    };
    authService.signIn.and.returnValue(Promise.resolve(user));
    await facade.signIn(email, password);
    expect(authService.signIn).toHaveBeenCalledWith(email, password);
    expect(store.selectSnapshot(AuthState)).toEqual({ user });
  });

  it('should handle sign in errors', async () => {
    const email = 'test@example.com';
    const password = 'testpassword';
    const error = new Error('test error');
    authService.signIn.and.returnValue(Promise.reject(error));
    await facade.signIn(email, password);
    expect(authService.signIn).toHaveBeenCalledWith(email, password);
    expect(store.selectSnapshot(AuthState)).toEqual({ user: null });
  });

  it('should sign up a user', async () => {
    const form = {
      email: 'test@example.com',
      type: 'testtype',
    };
    const user: IUser = {
      email: form.email,
      token: 'testtoken',
      type: form.type,
    };
    authService.signUp.and.returnValue(Promise.resolve(user));
    await facade.signUp(form);
    expect(authService.signUp).toHaveBeenCalledWith(form);
    expect(store.selectSnapshot(AuthState)).toEqual({ user });
  });

  it('should handle sign up errors', async () => {
    const form = {
      email: 'test@example.com',
      type: 'testtype',
    };
    const error = new Error('test error');
    authService.signUp.and.returnValue(Promise.reject(error));
    await facade.signUp(form);
    expect(authService.signUp).toHaveBeenCalledWith(form);
    expect(store.selectSnapshot(AuthState)).toEqual({ user: null });
  });

  it('should sign out a user', async () => {
    await facade.signOut();
    expect(authService.signOut).toHaveBeenCalled();
    expect(store.selectSnapshot(AuthState)).toEqual({ user: null });
  });

  it('should handle sign out errors', async () => {
    const error = new Error('test error');
    authService.signOut.and.returnValue(Promise.reject(error));
    await facade.signOut();
    expect(authService.signOut).toHaveBeenCalled();
    expect(store.selectSnapshot(AuthState)).toEqual({ user: null });
  });
  describe('AuthState', () => {
    it('should set the current user', () => {
      const user: IUser = {
        email: 'test@example.com',
        token: 'testtoken',
        type: 'testtype',
      };
      store.dispatch(new AuthActions.SetCurrentUser(user));
      expect(store.selectSnapshot(AuthState)).toEqual({ user });
    });

    it('should sign out a user', () => {
      store.dispatch(new AuthActions.SignOutAction());
      expect(store.selectSnapshot(AuthState)).toEqual({ user: null });
    });
  });
});
