import { TestBed } from '@angular/core/testing';
import { ConsumerFacade } from './consumer.facade';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { ErrorFacade } from '@features/error/services/error.facade';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';
import { of } from 'rxjs';
import { IError } from '@features/error/models/error.interface';

describe('ConsumerFacade', () => {
  let consumerFacade: ConsumerFacade;
  let authFacadeMock: jasmine.SpyObj<AuthFacade>;
  let errorFacadeMock: jasmine.SpyObj<ErrorFacade>;

  beforeEach(() => {
    const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['signUp']);
    const errorFacadeSpy = jasmine.createSpyObj('ErrorFacade', ['getError$']);

    TestBed.configureTestingModule({
      providers: [
        ConsumerFacade,
        { provide: AuthFacade, useValue: authFacadeSpy },
        { provide: ErrorFacade, useValue: errorFacadeSpy },
      ],
    });

    consumerFacade = TestBed.inject(ConsumerFacade);
    authFacadeMock = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
    errorFacadeMock = TestBed.inject(ErrorFacade) as jasmine.SpyObj<ErrorFacade>;
  });

  it('should be created', () => {
    expect(consumerFacade).toBeTruthy();
  });

  it('should call errorFacade.getError$ on getError', () => {
    const error: IError = {
        code: 1, message: 'Test error message',
        name: ''
    };
    errorFacadeMock.getError$.and.returnValue(of(error));

    const result$ = consumerFacade.getError();

    expect(errorFacadeMock.getError$).toHaveBeenCalledWith('auth');
    result$.subscribe((data) => {
      expect(data).toEqual(error);
    });
  });

  it('should call authFacade.signUp on signUp', async () => {
    const form: IConsumerForm = {
        email: '',
        type: ''
    };
    
    await consumerFacade.signUp(form);

    expect(authFacadeMock.signUp).toHaveBeenCalledWith(form);
  });
});
