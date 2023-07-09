import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProductSeller } from '@shared/models/product/product-seller.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductSellerService {
  currentSellerName$: string | undefined;
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {
    console.log('product seller service initialized');
  }

  public getProductSellerData(
    name?: string,
    search?: string,
    filterOptions?: any,
    sortOption?: any,
    page?: any,
    per_page?: any
  ): Observable<{ products: IProductSeller[]; totalCount: number }> {
    let url = `${this.apiUrl}productseller/sellerdashboard?seller_name=${name}`;

    if (search != undefined) {
      url += `&search=${search}`;
    }

    if (filterOptions) {
      for (const [key, value] of Object.entries(filterOptions)) {
        url += '&' + value;
      }
    }

    if (sortOption) {
      url += '&sort=' + sortOption;
    }
    if (page) {
      url += '&page=' + page;
    }
    if (per_page) {
      url += '&per_page=' + per_page;
    }

    return this.http.get(url).pipe(
      map((res: any) => ({
        products: res['data'] as IProductSeller[],
        totalCount: res['total_count'] as number,
      }))
    );
  }

  public updateProductSellerData(data: object): Observable<IProductSeller> {
    const url = `${this.apiUrl}productseller/produpdate`;
    return this.http.post<IProductSeller>(url, data);
  }

  public deleteProductSellerData(data: object): Observable<IProductSeller> {
    const url = `${this.apiUrl}productseller/proddelete`;
    return this.http.post<IProductSeller>(url, data);
  }
}
