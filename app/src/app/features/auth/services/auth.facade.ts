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
@Injectable()
export class AuthFacade {
  @Select(AuthSelectors.currentUser)
  private currentUser$!: Observable<IUser>;
  private redirectUrl: string | null = null;
  constructor(private authService: AuthService) {}

  @Dispatch()
  async signIn(email: string, password: string) {
    try {
      const user = await this.authService.signIn(email, password);
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
      if (form.type === 'seller') {
        return [
          new AuthActions.SetCurrentUser(user),
          new ErrorActions.ClearError('auth'),
          new Navigate(['pending']),
        ];
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
  async signOut() {
    try {
      if (!(await this.isLoggedIn())) {
        return new Navigate(['home']);
      }
      await this.authService.signOut();
      return [new AuthActions.SignOutAction(), new Navigate(['home'])];
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
}
