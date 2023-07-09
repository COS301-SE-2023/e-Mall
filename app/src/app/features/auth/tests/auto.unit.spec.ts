/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { AuthFacade } from '../services/auth.facade';
import { AuthService } from '../services/auth.service';
import { AuthState } from '../states/auth.state';
import * as AuthActions from '../states/auth.action';
import { IUser } from '../models/user.interface';
import { IError } from '@app/features/error/models/error.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Amplify, Auth, Hub } from 'aws-amplify';
import {
  ISignUpResult,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
describe('AuthModule', () => {
  let facade: AuthFacade;
  let authService: AuthService;
  let store: Store;
  let http: HttpClient;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AuthState])],
      providers: [
        AuthFacade,
        AuthService,
        {
          provide: HttpClient,
          useValue: jasmine.createSpyObj('HttpClient', ['post']),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    });
    facade = TestBed.inject(AuthFacade);
    authService = TestBed.inject(AuthService);
    store = TestBed.inject(Store);
    http = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
  });

  describe('AuthFacade', () => {
    it('should sign in a user', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const user: IUser = {
        email,
        token: 'testtoken',
        type: 'testtype',
      };
      spyOn(authService, 'signIn').and.returnValue(Promise.resolve(user));
      await facade.signIn(email, password);
      expect(authService.signIn).toHaveBeenCalledWith(email, password);
      expect(store.selectSnapshot(AuthState)).toEqual({ user });
    });

    it('should handle sign in errors', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const error = new Error('test error');
      spyOn(authService, 'signIn').and.returnValue(Promise.reject(error));
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
      spyOn(authService, 'signUp').and.returnValue(Promise.resolve(user));
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
      spyOn(authService, 'signUp').and.returnValue(Promise.reject(error));
      await facade.signUp(form);
      expect(authService.signUp).toHaveBeenCalledWith(form);
      expect(store.selectSnapshot(AuthState)).toEqual({ user: null });
    });

    it('should sign out a user', async () => {
      spyOn(authService, 'signOut').and.returnValue(Promise.resolve({}));
      await facade.signOut();
      expect(authService.signOut).toHaveBeenCalled();
      expect(store.selectSnapshot(AuthState)).toEqual({ user: null });
    });

    it('should handle sign out errors', async () => {
      const error = new Error('test error');
      spyOn(authService, 'signOut').and.returnValue(Promise.reject(error));
      await facade.signOut();
      expect(authService.signOut).toHaveBeenCalled();
      expect(store.selectSnapshot(AuthState)).toEqual({ user: null });
    });
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

  describe('AuthService', () => {
    it('should sign in a user', async () => {
      spyOn(Auth, 'signIn').and.returnValue(
        Promise.resolve({
          attributes: {
            email: 'test@example.com',
            email_verified: true,
            'custom:type': 'testtype',
          },
          signInUserSession: {
            accessToken: { jwtToken: 'testtoken' },
          },
        })
      );
      const user = await authService.signIn('test@example.com', 'testpassword');
      expect(user).toEqual({
        email: 'test@example.com',
        email_verified: true,
        token: 'testtoken',
        type: 'testtype',
      });
    });

    // it('should sign up a seller', async () => {
    //   const form = {
    //     email: 'test@example.com',
    //     password: 'testpassword',
    //     type: 'seller',
    //   };
    //   // (http.post as jasmine.Spy).calls.reset();

    //   // spyOn(http, 'post').and.returnValue(of({}));
    //   spyOn(Auth, 'signUp').and.callFake(() =>
    //     Promise.resolve<ISignUpResult>({
    //       user: new CognitoUser({
    //         Username: form.email,
    //         Pool: new CognitoUserPool({
    //           UserPoolId: 'us-east-1_testpool',
    //           ClientId: 'testclient',
    //         }),
    //       }),
    //       userConfirmed: true,
    //       userSub: 'testsub',
    //       codeDeliveryDetails: {
    //         AttributeName: 'email',
    //         DeliveryMedium: 'EMAIL',
    //         Destination: form.email,
    //       },
    //     })
    //   );
    //   // (http.post as jasmine.Spy).calls.reset();
    //   const hubListenSpy = jasmine.createSpyObj('Hub', ['listen']);
    //   hubListenSpy.listen.and.callFake((channel: any, callback: any) => {
    //     if (channel === 'auth' && typeof callback === 'function') {
    //       setTimeout(() => {
    //         callback({
    //           payload: {
    //             event: 'autoSignIn',
    //             data: {
    //               signInUserSession: { accessToken: { jwtToken: 'testtoken' } },
    //             },
    //           },
    //         });
    //       }, 0);
    //     }
    //     return () => {};
    //   });
    //   (authService as any).Hub = hubListenSpy;
    //   const user = await authService.signUp(form);
    //   expect(user).toEqual({
    //     email: form.email,
    //     token: 'testtoken',
    //     type: form.type,
    //   });
    // });

    // it('should sign up a consumer', async () => {
    //   const form = {
    //     email: 'test@example.com',
    //     password: 'testpassword',
    //     type: 'consumer',
    //   };

    //   // spyOn(http, 'post').and.returnValue(of({}));
    //   spyOn(Auth, 'signUp').and.callFake(() =>
    //     Promise.resolve<ISignUpResult>({
    //       user: new CognitoUser({
    //         Username: form.email,
    //         Pool: new CognitoUserPool({
    //           UserPoolId: 'us-east-1_testpool',
    //           ClientId: 'testclient',
    //         }),
    //       }),
    //       userConfirmed: true,
    //       userSub: 'testsub',
    //       codeDeliveryDetails: {
    //         AttributeName: 'email',
    //         DeliveryMedium: 'EMAIL',
    //         Destination: form.email,
    //       },
    //     })
    //   );
    //   const hubListenSpy = jasmine.createSpyObj('Hub', ['listen']);
    //   hubListenSpy.listen.and.callFake((channel: any, callback: any) => {
    //     if (channel === 'auth' && typeof callback === 'function') {
    //       setTimeout(() => {
    //         callback({
    //           payload: {
    //             event: 'autoSignIn',
    //             data: {
    //               signInUserSession: { accessToken: { jwtToken: 'testtoken' } },
    //             },
    //           },
    //         });
    //       }, 0);
    //     }
    //     return () => {};
    //   });
    //   (authService as any).Hub = hubListenSpy;

    //   const user = await authService.signUp(form);
    //   expect(user).toEqual({
    //     email: form.email,
    //     token: 'testtoken',
    //     type: form.type,
    //   });
    // });

    it('should handle sign up errors', async () => {
      const form = {
        email: 'test@example.com',
        password: 'testpassword',
        type: 'invalidtype',
      };
      try {
        await authService.signUp(form);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toEqual(new IError(-1, `invalid user type ${form.type}`));
      }
    });

    it('should sign out a user', async () => {
      spyOn(Auth, 'signOut').and.returnValue(Promise.resolve({}));
      await authService.signOut();
      expect(Auth.signOut).toHaveBeenCalled();
    });
  });
});
