/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IInventoryItem } from '@features/inventory/models/inventory-item.interface';
import { ISearchOptions } from '@features/inventory/models/search-options.interface';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  currentSellerName$: string | undefined;
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {
    console.log('product seller service initialized');
  }

  public getProductSellerData(
    options: ISearchOptions
  ): Observable<{ products: IInventoryItem[]; totalCount: number }> {
    let url = `${this.apiUrl}productseller/sellerdashboard?seller_name=${name}`;

    if (options.search != undefined) {
      url += `&search=${options.search}`;
    }

    if (options.filterOptions) {
      for (const [value] of Object.entries(options.filterOptions)) {
        url += '&' + value;
      }
    }

    if (options.sortOption) {
      url += '&sort=' + options.sortOption;
    }
    if (options.page) {
      url += '&page=' + options.page;
    }
    if (options.per_page) {
      url += '&per_page=' + options.per_page;
    }

    return this.http.get(url).pipe(
      map((res: any) => ({
        products: res['data'] as IInventoryItem[],
        totalCount: res['total_count'] as number,
      }))
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
