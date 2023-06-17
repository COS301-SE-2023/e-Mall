import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { IProductTemp } from '@app/models/product-temp.interface';
import { IProductSeller } from '../models/product-seller.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductPageService {
  currentProductId$: number | undefined;
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  public getProductData(id: number): Observable<IProductTemp> {
    const url = `${this.apiUrl}products/backend?prod_id=${id}`;
    return this.http.get<IProductTemp>(url);
  }
  public getSellerList(id: number): Observable<IProductSeller[]> {
    const url = `${this.apiUrl}productseller/backend?prod_id=${id}`;
    return this.http.get<IProductSeller[]>(url);
  }
}
