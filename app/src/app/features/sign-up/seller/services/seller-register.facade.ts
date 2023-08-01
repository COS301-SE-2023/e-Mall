import { Injectable } from '@angular/core';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { ErrorFacade } from '@features/error/services/error.facade';
import { Observable } from 'rxjs';
import { IError } from '@features/error/models/error.interface';
import { ISellerForm } from '../models/seller.interface';
@Injectable()
export class SellerFacade {
  constructor(
    private authFacade: AuthFacade,
    private errorFacade: ErrorFacade
  ) {}
  getError(): Observable<IError | null> {
    return this.errorFacade.getError$('auth');
  }

  async signUp(form: ISellerForm) {
    await this.authFacade.signUp(form);
  }
}
