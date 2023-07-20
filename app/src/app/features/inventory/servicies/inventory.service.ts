/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take, lastValueFrom, tap } from 'rxjs';
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
    const url = `${this.apiUrl}/get/`;

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

  public updateProductSellerData(data: object): void {
    const url = `${this.apiUrl}productseller/produpdate/`;
    this.http.post(url, data).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

  public deleteProductSellerData(data: object): void {
    const url = `${this.apiUrl}productseller/proddelete/`;
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
