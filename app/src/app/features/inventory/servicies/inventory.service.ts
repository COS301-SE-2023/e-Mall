/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take, lastValueFrom, firstValueFrom, debounceTime } from 'rxjs';
import { IInventoryItem } from '@features/inventory/models/inventory-item.interface';
import { ISearchOptions } from '@features/inventory/models/search-options.interface';

@Injectable()
export class InventoryService {
  currentSellerName$: string | undefined;
  private apiUrl = '/api/inventory';

  constructor(private http: HttpClient) {}

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

  public async getSimilarProducts(data: string): Promise<any> {
    const url = `${this.apiUrl}/getSimilarProducts/`;
    const res = await lastValueFrom(
      this.http
        .post(
          url,
          { name: data },
          {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/json')
              .set('Authorization', 'true'),
            observe: 'response',
          }
        )
        .pipe(take(1), debounceTime(1000))
    );
    return res.body;
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
  public async downloadFile(): Promise<any> {
    const url = `${this.apiUrl}/download_format/`;
    return await firstValueFrom(
      this.http.post(
        url,
        {},
        {
          headers: new HttpHeaders().set('Authorization', 'true'),
          responseType: 'blob',
        }
      )
    );
  }
  public async uploadBulkData(data: any): Promise<any> {
    const url = `${this.apiUrl}/upload_bulk/`;
    return await firstValueFrom(
      this.http.post(url, data, {
        headers: new HttpHeaders().set('Authorization', 'true'),
        responseType: 'blob',
      })
    );
  }
}
