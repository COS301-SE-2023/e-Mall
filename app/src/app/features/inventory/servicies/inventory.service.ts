/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take, lastValueFrom } from 'rxjs';
import { IInventoryItem } from '@features/inventory/models/inventory-item.interface';
import { ISearchOptions } from '@features/inventory/models/search-options.interface';

@Injectable()
export class InventoryService {
  currentSellerName$: string | undefined;
  private apiUrl = 'api/inventory';

  constructor(private http: HttpClient) {
    console.log('product seller service initialized');
  }

  public async getProductSellerData(
    options: ISearchOptions
  ): Promise<{ products: IInventoryItem[]; totalCount: number }> {
    const url = `${this.apiUrl}/getProd/`;

    return await lastValueFrom(
      this.http
        .post(url, options, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(
          take(1),
          map((res: any) => ({
            products: res.body.data as IInventoryItem[],
            totalCount: res.body.total_count as number,
          }))
        )
    );
  }

  public async updateProductSellerData(data: IInventoryItem): Promise<any> {
    const url = `${this.apiUrl}/update/`;
    return await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1))
    );
  }

  public async deleteProductSellerData(data: object): Promise<any> {
    const url = `${this.apiUrl}/delete/`;
    return await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1))
    );
  }

  public async getSimilarProducts(data: object): Promise<any> {
    const url = `${this.apiUrl}/getSimilarProducts/`;
    return await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1))
    );
  }

  public async addSimilarProduct(data: object): Promise<any> {
    const url = `${this.apiUrl}/createSimilarProduct/`;
    return await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1))
    );
  }

  public async addnewProduct(data: object): Promise<any> {
    const url = `${this.apiUrl}/createNewProduct/`;
    return await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1))
    );
  }
}
