/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  Observable,
  firstValueFrom,
  lastValueFrom,
  map,
  shareReplay,
  take,
} from 'rxjs';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { IProduct } from '@shared/models/product/product.interface';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConsumerService {
  private apiUrl = 'http://localhost:3000/api/consumer/';

  constructor(private http: HttpClient) {
    console.log('product seller service initialized');
  }

  async getConsumerInfo(): Promise<any> {
    const url = `${this.apiUrl}get_consumer_info/`;
    const res = (await lastValueFrom(
      this.http

        .post(
          url,
          {},
          {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/json')
              .set('Authorization', 'true'),
            observe: 'response',
          }
        )
        .pipe(take(1), shareReplay(1))
    )) as HttpResponse<any>;
    map((res: any) => ({
      products: res['product_data'] as IProduct[],
      sellers: res['seller_data'] as IProductSeller[],
    }));
    return res.body;
  }
}
