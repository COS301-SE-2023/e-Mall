/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';
import { ErrorFacade } from '@features/error/services/error.facade';
import { Observable } from 'rxjs';
import { IError } from '@features/error/models/error.interface';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { SetError } from '@app/features/error/states/error.action';
@Injectable()
export class ConsumerFacade {
  constructor(
    private authFacade: AuthFacade,
    private errorFacade: ErrorFacade
  ) {}
  getError(): Observable<IError | null> {
    return this.errorFacade.getError$('auth');
  }

  async signUp(form: IConsumerForm) {
    try {
      await this.authFacade.signUp(form);
    } catch (e) {
      this.setError(e);
    }
  }
  public async confirmSignUp(email: string, code: string) {
    try {
      return await this.authFacade.confirmSignUp(email, code);
    } catch (e) {
      return this.setError(e);
    }
  }
  async congnitoSignUp(email: string, password: string, type: string) {
    try {
      await this.authFacade.congnitoSignUp(email, password, type);
    } catch (e) {
      this.setError(e);
    }
  }
  @Dispatch()
  setError(error: any) {
    // this.toast.presentErrorToastWithMessage(error);
    return new SetError('consumer', error as IError);
  }
}
