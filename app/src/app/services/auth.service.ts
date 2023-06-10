/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  catchError,
  Observable,
  throwError,
  switchMap,
  from,
  map,
  BehaviorSubject,
} from 'rxjs';
import { ISellerForm } from '@app/models/seller.interface';
import { Amplify, Auth } from 'aws-amplify';

import { environment } from '../../environments/env';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  base_url = 'http://localhost:3000/api/'; // change in deployment
  private authenticationSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signIn(email: string, password: string): Observable<unknown> {
    return from(
      Auth.signIn(email, password).then(() => {
        this.authenticationSubject.next(true);
      })
    );
  }

  public sellerSignUp(seller: ISellerForm): Observable<unknown> {
    const password = seller.password;
    // const code = seller.verification_code;

    seller.password = undefined;
    seller.verification_code = undefined;
    return this.signUpSellerDB(seller).pipe(
      switchMap(response => {
        console.log('signUpDB() was successful:', response);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

        return this.signUpCognito(seller.email, password!, seller.type).pipe(
          map(() => {
            return response;
          }),
          catchError(error => {
            console.error('Error in signUpCognito():', error);
            return throwError(() => error);
          })
        );
      }),
      catchError(error => {
        console.error('Error in register():', error);
        return throwError(() => error);
      })
    );
  }
  private signUpSellerDB(seller: ISellerForm): Observable<unknown> {
    const url = `${this.base_url}seller/register/`;
    const data = JSON.stringify(seller);
    return this.http
      .post(url, data, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        observe: 'response',
      })
      .pipe(
        catchError(error => {
          console.error('Error in signUpDB():', error);
          return throwError(() => error);
        })
      );
  }
  private signUpCognito(
    email: string,
    password: string,
    type: string
  ): Observable<any> {
    console.log('');
    const promise = Auth.signUp({
      username: email,
      password: password,
      attributes: { 'custom:type': type },
    });
    return from(promise).pipe(
      catchError(error => {
        console.error('Error in signUpCognito():', error);
        return throwError(() => error);
      })
    );
  }
  public confirmSignUp(
    email: string,
    verificatn_code: string
  ): Observable<unknown> {
    return from(Auth.confirmSignUp(email, verificatn_code));
  }
  public signOut(): Observable<unknown> {
    return from(
      Auth.signOut().then(() => {
        this.authenticationSubject.next(false);
      })
    );
  }
  public isAuthenticated(): Observable<boolean> {
    if (this.authenticationSubject.value) {
      return from(Promise.resolve(true));
    } else {
      return from(
        Auth.currentUserInfo()
          .then((user: any) => {
            if (user) {
              return true;
            } else {
              return false;
            }
          })
          .catch(() => {
            return false;
          })
      );
    }
  }
  public getUserCognito(): Observable<unknown> {
    return from(Auth.currentUserInfo());
  }
  public getAccessTokenCognito(): Observable<string> {
    return from(
      Auth.currentSession().then(session => {
        return session.getAccessToken().getJwtToken();
        // return token;
      })
    );
  }
  public getCurrentUserDB(email: string): Observable<any> {
    const url = `${this.base_url}seller/`;
    const data = JSON.stringify(email);
    return this.http
      .post(url, data, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        observe: 'response',
      })
      .pipe(
        catchError(error => {
          console.error('Error in signUpDB():', error);
          return throwError(() => error);
        })
      );
  }
  public authTest(): Observable<any> {
    const url = `${this.base_url}seller/auth_test/`;
    const email = 'test2@test.com';
    const data = {
      email: email,
    };
    console.log('im here');
    return this.http
      .post(url, data, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', 'true'),
        observe: 'response',
      })
      .pipe(
        catchError(error => {
          console.error('Error in authTest():', error);
          return throwError(() => error);
        })
      );
  }
}
