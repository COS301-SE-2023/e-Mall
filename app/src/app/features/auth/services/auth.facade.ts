import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthSelectors } from '../states/auth.selector';
import { IUser } from '../models/user.interface';
import { AuthService } from './auth.service';
import * as AuthActions from '../states/auth.action';
import { ISellerForm } from '@features/sign-up/seller/models/seller.interface';
import { Navigate } from '@ngxs/router-plugin';
import { SetError } from '@app/features/error/states/error.action';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';
import { IError } from '@app/features/error/models/error.interface';
import * as ErrorActions from '@features/error/states/error.action';
//import { LoaderFacade } from '../../../shared/components/loader/loader.facade';
import { StateResetAll } from 'ngxs-reset-plugin';
import { ToastComponent } from '@app/shared/components/toast/toast.component';
//import { LoaderFacade } from '../../../shared/components/loader/loader.facade';
@Injectable()
export class AuthFacade {
  @Select(AuthSelectors.currentUser)
  private currentUser$!: Observable<IUser>;
  private redirectUrl: string | null = null;
  public confirmed = false;

  constructor(
    private toast: ToastComponent,
    private authService: AuthService //private loaderService: LoaderFacade
  ) {
    /*loaderService.addActions([
      AuthActions.SignOutAction,
      AuthActions.SetCurrentUser,
    ]);*/
  }

  @Dispatch()
  async signIn(email: string, password: string) {
    try {
      const user = await this.authService.signIn(email, password);
      if (user === null) {
        throw Error('Account does not exist');
      }
      if (this.redirectUrl) {
        const actions = [
          new AuthActions.SetCurrentUser(user),
          new ErrorActions.ClearError('auth'),
          new Navigate([this.redirectUrl]),
        ];
        this.redirectUrl = null;
        return actions;
      }
      return [
        new AuthActions.SetCurrentUser(user),
        new ErrorActions.ClearError('auth'),
        new Navigate(['home']),
      ];
    } catch (error) {
      return new SetError('auth', error as IError);
    }
  }
  @Dispatch()
  async signUp(form: ISellerForm | IConsumerForm) {
    try {
      const user = await this.authService.signUp(form);
      // if (form.type === 'seller') {
      //   return [
      //     new AuthActions.SetCurrentUser(user),
      //     new ErrorActions.ClearError('auth'),
      //     new Navigate(['pending']),
      //   ];
      // }
      this.toast.presentSuccessToast('Successfully signed up');
      return [
        // new AuthActions.SetCurrentUser(user),
        // new ErrorActions.ClearError('auth'),
        // new Navigate(['home']),
        new Navigate(['sign-in']),
      ];
    } catch (error) {
      return new SetError('auth', error as IError);
    }
  }
  async congnitoSignUp(email: string, password: string, type: string) {
    return await this.authService.cognitoSignUp(email, password, type);
  }
  @Dispatch()
  async signOut() {
    try {
      if (!(await this.isLoggedIn())) {
        return new Navigate(['home']);
      }
      await this.authService.signOut();
      return [new StateResetAll(), new Navigate(['home'])];
      // return [new AuthActions.SignOutAction(), new Navigate(['home'])];
    } catch (error) {
      return new SetError('auth', error as IError);
    }
  }
  @Dispatch()
  updateToken(token: string) {
    return new AuthActions.UpdateToken(token);
  }
  getCurrentUser(): Observable<IUser | null> {
    return this.currentUser$;
  }
  async refreshAccessToken(): Promise<string> {
    const token = await this.authService.refreshAccessToken();
    this.updateToken(token);
    return token;
  }
  async isLoggedIn(): Promise<boolean> {
    const currentUser = await firstValueFrom(this.currentUser$);
    return currentUser !== null;
  }
  async getUserType(): Promise<string> {
    const currentUser = await firstValueFrom(this.currentUser$);
    return currentUser.type;
  }
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }
  public async confirmSignUp(email: string, code: string) {
    try {
      const res = await this.authService.confirmSignUp(email, code);
      this.confirmed = true;

      return res;
    } catch (error) {
      return this.setError(error);
    }
  }
  public resend(email: string) {
    return this.authService.resend(email);
  }
  @Dispatch()
  setError(error: any) {
    this.toast.presentErrorToastWithMessage(error);
    return new SetError('consumer', error as IError);
  }

  async doesEmailExist(email: string) {
    try {
      return await this.authService.checkEmail(email);
    } catch (e) {
      return this.setError(e);
    }
  }
  async requestForgotPassword(email: string) {
    try {
      return await this.authService.forgotpassword(email);
    } catch (e) {
      return this.setError(e);
    }
  }
  @Dispatch()
  async confirmForgotPassword(email: string, code: string, password: string) {
    return await this.authService
      .confirmForgotPassword(email, code, password)
      .then(() => {
        this.toast.presentSuccessToast('Successfully changed password');
        return [new Navigate(['sign-in'])];
      })
      .catch(e => {
        return this.setError(e);
      });
  }
}
