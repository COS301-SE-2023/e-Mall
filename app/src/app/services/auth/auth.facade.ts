import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthSelectors } from './state/auth.selector';
import { IUser } from './model/user.interface';
import { AuthService } from './service/auth.service';
import * as AuthActions from './state/auth.action';
import { ISellerForm } from '@app/models/seller/seller.interface';
import { Navigate } from '@ngxs/router-plugin';
import { SetError } from '@shared/error/state/error.action';
import { IConsumerForm } from '@app/models/consumer/consumer.interface';
import { IError } from '@shared/error/model/error.interface';
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
