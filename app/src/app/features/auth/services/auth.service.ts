/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, take } from 'rxjs';
import { ISellerForm } from '@features/sign-up/seller/models/seller.interface';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { environment } from '../../../../environments/env';
import { Router } from '@angular/router';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';
import { IUser } from '../models/user.interface';
import { IError } from '@app/features/error/models/error.interface';
@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    Amplify.configure({
      Auth: environment.cognito,
    });
  }

  async signIn(email: string, password: string): Promise<IUser | null> {
    //TODO: add sign in check to backend db
    const res = await this.checkEmail(email);
    if (res) {
      const cognitoUser = await Auth.signIn(email, password);
      const user: IUser = {
        email: cognitoUser.attributes.email,
        email_verified: cognitoUser.attributes.email_verified,
        token: cognitoUser.signInUserSession.accessToken.jwtToken,
        type: cognitoUser.attributes['custom:type'],
      };
      return user;
    }
    return null;
  }

  public async signUp(form: ISellerForm | IConsumerForm): Promise<IUser> {
    let url = '';
    if (form.type === 'seller') {
      url = '/api/seller/register/';
    } else if (form.type === 'consumer') {
      url = '/api/consumer/register/';
    } else {
      throw new IError(-1, `invalid user type ${form.type}`);
    }
    const password = form.password;
    form.password = undefined;
    form.verification_code = undefined;
    const data = JSON.stringify(form);
    await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
          observe: 'response',
        })
        .pipe(take(1))
    );

    await this.cognitoSignUp(form.email, password!, form.type);
    const res = await this.waitForAutoSignIn();

    const user: IUser = {
      email: form.email,
      token: res.signInUserSession.accessToken.jwtToken,
      type: form.type,
    };
    return user;
  }
  waitForAutoSignIn(): any {
    return new Promise((resolve, reject) => {
      Hub.listen('auth', ({ payload }) => {
        const { event } = payload;
        if (event === 'autoSignIn') {
          resolve(payload.data);
        } else if (event === 'autoSignIn_failure') {
          reject(new IError(400, 'Error in signup'));
        }
      });
    });
  }

  async cognitoSignUp(
    email: string,
    password: string,
    type: string
  ): Promise<unknown> {
    return Auth.signUp({
      username: email,
      password: password,
      attributes: { 'custom:type': type },
      autoSignIn: {
        enabled: true,
      },
    });
  }
  async signOut(): Promise<unknown> {
    return await Auth.signOut();
  }
  async refreshAccessToken(): Promise<string> {
    // refresh the session
    await Auth.currentAuthenticatedUser({ bypassCache: true });
    // get the current session
    const session = await Auth.currentSession();
    // get the new access token
    const newAccessToken = session.getAccessToken().getJwtToken();
    // update your application state with the new access token
    // ...
    return newAccessToken;
  }

  public async checkEmail(email: string) {
    const url = '/api/auth/check_email/';
    const data = { email: email };
    const res = await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
          observe: 'response',
        })
        .pipe(take(1))
    );
    return res.body;
  }
}
