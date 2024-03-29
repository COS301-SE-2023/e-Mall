/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISeller } from '@shared/models/seller/seller.interface';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  currentSellerName$: string | undefined;
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  public getSellerData(data: object): Observable<ISeller> {
    const url = `${this.apiUrl}seller/seller_info/`;
    return this.http.post<ISeller>(url, data);
  }

  public updateSellerData(data: object): void {
    const url = `${this.apiUrl}seller/update_info/`;
    this.http.post(url, data).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }
}
