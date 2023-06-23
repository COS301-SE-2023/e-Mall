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
  public getSellerList(id: number): Observable<IProductSeller[]> {
    const url = `${this.apiUrl}productseller/backend?prod_id=${id}`;
    return this.http.get<IProductSeller[]>(url);
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
      for (const [key, value] of Object.entries(filterOptions)) {
        url += '&' + value;
      }
    }

    if (sortOption) {
      url += '&sort=' + sortOption;
    }

    if (page) {
      url += '&page=' + page;
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
