import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError, switchMap, from, map } from 'rxjs';
import { ISellerForm, ISellerProfile } from '@app/models/seller.interface';
import { CognitoService } from '@service/cognito.service';
import { response } from '../models/response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  base_url = 'http://localhost:3000/api/'; // change in deployment

  constructor(
    private http: HttpClient,
    private cognitoService: CognitoService
  ) {}
  // public signIn() {

  // }

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
    const promise = this.cognitoService.signUp(email, password);
    return from(promise).pipe(
      catchError(error => {
        console.error('Error in signUpCognito():', error);
        return throwError(() => error);
      })
    );
  }
}
