import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {
  catchError,
  Observable,
  throwError,
  switchMap,
  from,
  map,
  tap,
  BehaviorSubject,
} from 'rxjs';
import { ISellerForm, ISellerProfile } from '@app/models/seller.interface';
import { response } from '../models/response.interface';
import { Amplify, Auth } from 'aws-amplify';

import { environment } from '../../environments/env';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  base_url = 'http://localhost:3000/api/'; // change in deployment
  private authenticationSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router) {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signIn(email: string, password: string): Observable<any> {
    return from(
      Auth.signIn(email, password).then(() => {
        this.authenticationSubject.next(true);
      })
    );
  }

  public sellerSignUp(seller: ISellerForm): Observable<any> {
    const password = seller.password;
    const code = seller.verification_code;

    seller.password = undefined;
    seller.verification_code = undefined;
    return this.signUpDB(seller).pipe(
      switchMap(response => {
        console.log('signUpDB() was successful:', response);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.signUpCognito(seller.email, password!).pipe(
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
  private signUpDB(seller: ISellerForm): Observable<any> {
    const url = `${this.base_url}seller/`;
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
  private signUpCognito(email: string, password: string): Observable<any> {
    const promise = Auth.signUp(email, password);
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
  ): Observable<any> {
    return from(Auth.confirmSignUp(email, verificatn_code));
  }
  public signOut(): Observable<any> {
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
  public getUser(): Observable<any> {
    return from(Auth.currentUserInfo());
  }
  public getAccessToken(): Observable<string> {
    return from(Auth.currentSession()).pipe(
      switchMap(session => from(session.getAccessToken().getJwtToken()))
    );
  }
}
