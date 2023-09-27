/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, mergeMap } from 'rxjs';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { IProduct } from '@shared/models/product/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ConsumerService {
  private apiUrl = 'http://localhost:3000/api/consumer/';

  constructor(private http: HttpClient) {
  }

  public getConsumerInfo(email: string): Observable<any> {
    const data = {
      email: email,
    };
    const url = `${this.apiUrl}get_consumer_info/`;
    return this.http.post(url, data).pipe(
      map((res: any) => ({
        products: res['product_data'] as IProduct[],
        sellers: res['seller_data'] as IProductSeller[],
      }))
    );
  }
}
