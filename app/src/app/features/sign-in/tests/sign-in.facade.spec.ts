/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { SignInFacade } from '../services/sign-in.facade';
import { AuthFacade } from '@app/features/auth/services/auth.facade';
import { ErrorFacade } from '@features/error/services/error.facade';

describe('SignInFacade', () => {
  let facade: SignInFacade;
  let authFacade: AuthFacade;
  let errorFacade: ErrorFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SignInFacade,
        {
          provide: AuthFacade,
          useValue: jasmine.createSpyObj('AuthFacade', ['signIn', 'getError$']),
        },
        {
          provide: ErrorFacade,
          useValue: jasmine.createSpyObj('ErrorFacade', ['getError$']),
        },
      ],
    });

    facade = TestBed.inject(SignInFacade);
    authFacade = TestBed.inject(AuthFacade);
    errorFacade = TestBed.inject(ErrorFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('signIn', () => {
    it('should call signIn method of auth facade with email and password', async () => {
      await facade.signIn('test@test.com', 'password!Q1');
      expect(authFacade.signIn).toHaveBeenCalledWith(
        'test@test.com',
        'password!Q1'
      );
    });
  });

  describe('getError$', () => {
    it('should call getError$ method of error facade with "auth" argument', () => {
      facade.getError();
      expect(errorFacade.getError$).toHaveBeenCalledWith('auth');
    });
  });
});
