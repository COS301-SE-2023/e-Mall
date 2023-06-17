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

  searchProducts(query: string): Observable<IProduct[]> {
    const url = `${this.apiUrl}?search=${query}`;

    return this.http
      .get(url)
      .pipe(map((res: any) => res['data'] as IProduct[]));
  }

  // Other methods for CRUD operations on products can be added here
}
