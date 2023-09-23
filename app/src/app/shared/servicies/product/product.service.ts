/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, distinct, map, mergeMap, toArray } from 'rxjs';
import { IProduct } from '@shared/models/product/product.interface';
import { IProductSeller } from '@shared/models/product/product-seller.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private apiUrl = 'http://localhost:3000/api/products/backend';
  currentProductId$: number | undefined;
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {
    console.log('product service initialized');
  }

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
    const url = `${this.apiUrl}products/popularproducts/`;
    return this.http.get(url).pipe(map((res: any) => res as IProduct[]));
  }
  public getTrendingProducts(): Observable<IProduct[]> {
    const url = `${this.apiUrl}products/trendingproducts/`;
    return this.http.get(url).pipe(map((res: any) => res as IProduct[]));
  }

  public getForYouProducts(): Observable<IProduct[]> {
    //Algo needs to be implemented
    //Mock data for demo
    const url = `${this.apiUrl}products/test?search=x`;
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

  getCategoryProducts(
    category: string,
    sortOption?: any
  ): Observable<IProduct[]> {
    let url = `${this.apiUrl}products/backend/?filter_category=${category}`;
    // filterOptions = { };
    url += '&per_page=100';
    if (sortOption) {
      url += '&sort=' + sortOption;
    }
    return this.http.get(url).pipe(
      map((res: any) => res['data'] as IProduct[]),
      mergeMap((products: IProduct[]) => products),
      distinct((product: IProduct) => product.id),
      toArray()
    );
    // Other methods for CRUD operations on products can be added here
  }
}
