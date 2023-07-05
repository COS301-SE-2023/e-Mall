/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ISellerForm } from '@features/sign-up/seller/models/seller.interface';
import { Amplify, Auth } from 'aws-amplify';

import { environment } from '../../../../environments/env';
import { Router } from '@angular/router';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';
import { IUser } from '../models/user.interface';
import { IError } from '@app/features/error/models/error.interface';
@Injectable()
export class AuthService {
  base_url = 'http://localhost:3000/api/'; // change in deployment
  // private authenticationSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    Amplify.configure({
      Auth: environment.cognito,
    });

    // this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  async signIn(email: string, password: string): Promise<IUser> {
    const cognitoUser = await Auth.signIn(email, password);
    const user: IUser = {
      email: cognitoUser.attributes.email,
      email_verified: cognitoUser.attributes.email_verified,
      token: cognitoUser.signInUserSession.accessToken.jwtToken,
      type: cognitoUser.attributes['custom:type'],
    };
    return user;
  }

  public async signUp(form: ISellerForm | IConsumerForm): Promise<IUser> {
    // const code = seller.verification_code;
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
    return await lastValueFrom(
      this.http.post(url, data, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        observe: 'response',
      })
    )
      .then(() => {
        return this.cognitoSignUp(form.email, password!, form.type);
      })
      .then(res => {
        //TODO: need to see what is returned from cognito
        const user: IUser = {
          email: form.email,
          token: '1',
          type: form.type,
        };
        return user;
      })
      .catch(error => {
        return error;
      });
  }

  // private sellerSignUpDB(seller: ISellerForm): Observable<unknown> {
  //   const url = '/api/seller/register/';
  //   const data = JSON.stringify(seller);
  //   return this.http.post(url, data, {
  //     headers: new HttpHeaders().set('Content-Type', 'application/json'),
  //     observe: 'response',
  //   });
  // }

  private async cognitoSignUp(
    email: string,
    password: string,
    type: string
  ): Promise<unknown> {
    return Auth.signUp({
      username: email,
      password: password,
      attributes: { 'custom:type': type },
    });
  }

  public async confirmSignUp(
    email: string,
    verificatn_code: string
  ): Promise<unknown> {
    return Auth.confirmSignUp(email, verificatn_code);
  }
  public async signOut(): Promise<unknown> {
    return await Auth.signOut();
  }
  // public isAuthenticated(): Observable<boolean> {
  //   if (this.authenticationSubject.value) {
  //     return from(Promise.resolve(true));
  //   } else {
  //     return from(
  //       Auth.currentUserInfo()
  //         .then((user: any) => {
  //           if (user) {
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         })
  //         .catch(() => {
  //           return false;
  //         })
  //     );
  //   }
  // }
  // public getUserCognito(): Observable<unknown> {
  //   return from(Auth.currentUserInfo());
  // }
  // public getAccessTokenCognito(): Observable<string> {
  //   return from(
  //     Auth.currentSession().then(session => {
  //       return session.getAccessToken().getJwtToken();
  //       // return token;
  //     })
  //   );
  // }
  // public getCurrentUserDB(email: string): Observable<any> {
  //   const url = `${this.base_url}seller/`;
  //   const data = JSON.stringify(email);
  //   return this.http
  //     .post(url, data, {
  //       headers: new HttpHeaders().set('Content-Type', 'application/json'),
  //       observe: 'response',
  //     })
  //     .pipe(
  //       catchError(error => {
  //         console.error('Error in signUpDB():', error);
  //         return throwError(() => error);
  //       })
  //     );
  // }
  // public authTest(): Observable<any> {
  //   const url = `${this.base_url}seller/auth_test/`;
  //   const email = 'test2@test.com';
  //   const data = {
  //     email: email,
  //   };
  //   console.log('im here');
  //   return this.http
  //     .post(url, data, {
  //       headers: new HttpHeaders()
  //         .set('Content-Type', 'application/json')
  //         .set('Authorization', 'true'),
  //       observe: 'response',
  //     })
  //     .pipe(
  //       catchError(error => {
  //         console.error('Error in authTest():', error);
  //         return throwError(() => error);
  //       })
  //     );
  // }
}
