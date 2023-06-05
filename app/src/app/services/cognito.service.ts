/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, switchMap } from 'rxjs';
import { Amplify, Auth } from 'aws-amplify';

import { environment } from '../../environments/env';
@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(email: string, password: string): Promise<any> {
    return Auth.signUp({
      username: email,
      password: password!,
    });
  }

  public confirmSignUp(email: string, verificatn_code: string): Promise<any> {
    return Auth.confirmSignUp(email, verificatn_code);
  }

  public signIn(email: string, password: string): Promise<any> {
    return Auth.signIn(email, password).then(() => {
      this.authenticationSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
        .then((user: any) => {
          if (user) {
            return true;
          } else {
            return false;
          }
        })
        .catch(() => {
          return false;
        });
    }
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  // public updateUser(user: IUser): Promise<any> {
  //   return Auth.currentUserPoolUser().then((cognitoUser: any) => {
  //     return Auth.updateUserAttributes(cognitoUser, user);
  //   });
  // }

  public getAccessToken(): Observable<string> {
    return from(Auth.currentSession()).pipe(
      switchMap(session => from(session.getAccessToken().getJwtToken()))
    );
  }
}
