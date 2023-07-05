import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthSelectors } from '../states/auth.selector';
import { IUser } from '../models/user.interface';
import { AuthService } from './auth.service';
import * as AuthActions from '../states/auth.action';
import { ISellerForm } from '@features/sign-up/seller/models/seller.interface';
import { Navigate } from '@ngxs/router-plugin';
import { SetError } from '@app/features/error/states/error.action';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';
import { IError } from '@app/features/error/models/error.interface';
import { StateResetAll, StateClear } from 'ngxs-reset-plugin';

@Injectable()
export class AuthFacade {
  @Select(AuthSelectors.currentUser)
  private currentUser$!: Observable<IUser>;

  constructor(private authService: AuthService) {}

  @Dispatch()
  async signIn(email: string, password: string) {
    try {
      const user = await this.authService.signIn(email, password);
      return [new AuthActions.SetCurrentUser(user), new Navigate(['home'])];
    } catch (error) {
      return new SetError('auth', error as IError);
    }
  }
  @Dispatch()
  async signUp(form: ISellerForm | IConsumerForm) {
    try {
      const user = await this.authService.signUp(form);
      new AuthActions.SetCurrentUser(user);
      if (form.type === 'seller') {
        return new Navigate(['pending']);
      }
      return new Navigate(['home']);
    } catch (error) {
      return new SetError('auth', error as IError);
    }
  }
  @Dispatch()
  async signOut() {
    try {
      await this.authService.signOut();
      return [
        //new StateResetAll(); //enable this only if needed
        new AuthActions.SignOutAction(),
        new Navigate(['home']),
      ];
    } catch (error) {
      return new SetError('auth', error as IError);
    }
  }

  async confirmSignUp(email: string, verification_code: string) {
    return await this.authService.confirmSignUp(email, verification_code);
  }
  getCurrentUser(): Observable<IUser | null> {
    return this.currentUser$;
  }
  // async getAccessToken(): Observable<IUser| null> {
  //   if (this.currentUser$) {
  //     const user = await lastValueFrom(this.currentUser$);
  //     return d ;
  //   }
  // }
}
