/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProduct } from '@app/models/product/product.interface';
import { IProductSeller } from '@app/models/product/product-seller.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private apiUrl = 'http://localhost:3000/api/products/backend';
  currentProductId$: number | undefined;
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  public getProductData(id: number): Observable<IProduct> {
    const url = `${this.apiUrl}products/frontend?prod_id=${id}`;
    return this.http.get<IProduct>(url);
  }
  public getSellerList(
    id: number,
    inStock: string
  ): Observable<IProductSeller[]> {
    const url = `${this.apiUrl}productseller/backend?prod_id=${id}`;
    if (inStock == 'true') {
      return this.http.get<IProductSeller[]>(url + '&filter_in_stock=true');
    } else {
      return this.http.get<IProductSeller[]>(url);
    }
  }

  public getPopProducts(): Observable<IProduct[]> {
    //Algo needs to be implemented
    //Mock data for demo
    const url = `${this.apiUrl}products/backend?search=a`;
    return this.http
      .get(url)
      .pipe(map((res: any) => res['data'] as IProduct[]));
  }

  public getForYouProducts(): Observable<IProduct[]> {
    //Algo needs to be implemented
    //Mock data for demo
    const url = `${this.apiUrl}products/backend?search=f`;
    return this.http
      .get(url)
      .pipe(map((res: any) => res['data'] as IProduct[]));
  }

  searchProducts(
    query: string,
    filterOptions?: any,
    sortOption?: any,
    page?: any,
    per_page?: any
  ): Observable<{ products: IProduct[]; totalCount: number }> {
    let url = `${this.apiUrl}products/test?search=${query}`;
    // filterOptions = { };
    if (filterOptions) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        products: res['data'] as IProduct[],
        totalCount: res['total_count'] as number,
      }))
    );
  }

  // Other methods for CRUD operations on products can be added here
}
