import { Injectable } from '@angular/core';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';

@Injectable()
export class ConsumerFacade {
  constructor(private authFacade: AuthFacade) {}

  async signUp(form: IConsumerForm) {
    this.authFacade.signUp(form);
  }
}
