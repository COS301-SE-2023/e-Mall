import { Injectable } from '@angular/core';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { ErrorFacade } from '@features/error/services/error.facade';
import { Observable } from 'rxjs';
import { IError } from '@features/error/models/error.interface';
@Injectable()
export class SignInFacade {
  constructor(
    private authFacade: AuthFacade,
    private errorFacade: ErrorFacade
  ) {}
  getError(): Observable<IError | null> {
    return this.errorFacade.getError$('auth');
  }

  async signIn(email: string, password: string) {
    await this.authFacade.signIn(email, password);
  }
}
