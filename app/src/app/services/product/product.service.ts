import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProduct } from '@app/models/product/product.interface';
import { any } from 'cypress/types/bluebird';
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
  public getSellerList(id: number): Observable<IProductSeller[]> {
    const url = `${this.apiUrl}productseller/backend?prod_id=${id}`;
    return this.http.get<IProductSeller[]>(url);
  }

  searchProducts(
    query: string,
    filterOptions?: any,
    sortOption?: any
  ): Observable<IProduct[]> {
    let url = `${this.apiUrl}products/backend?search=${query}`;
    // filterOptions = { };
    if (filterOptions) {
      for (const [key, value] of Object.entries(filterOptions)) {
        url += `&${key}=${value}`;
      }
    }

    if (sortOption) {
      url += '&sort=' + sortOption;
    }

    return this.http
      .get(url)
      .pipe(map((res: any) => res['data'] as IProduct[]));
  }
  // Other methods for CRUD operations on products can be added here
}
