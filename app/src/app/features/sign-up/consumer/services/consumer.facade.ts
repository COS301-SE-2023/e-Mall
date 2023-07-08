import { Injectable } from '@angular/core';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';
import { ErrorFacade } from '@features/error/services/error.facade';
import { pipe, take, Subscription, Observable } from 'rxjs';
import { IError } from '@features/error/models/error.interface';
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
    form.type = 'consumer';
    await this.authFacade.signUp(form);
    console.log('signUp finished');
  }
}
