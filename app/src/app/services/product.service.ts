import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProduct } from '../models/product.interface';
import { any } from 'cypress/types/bluebird';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products/backend';

  constructor(private http: HttpClient) {}

  searchProducts(
    query: string,
    filterOptions?: any,
    sortOption?: any
  ): Observable<IProduct[]> {
    let url = `${this.apiUrl}?search=${query}`;
    filterOptions = { filter_date_min: 'Marshall-Flores', filter_date_max: 'Clothing' };
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
