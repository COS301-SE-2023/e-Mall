import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductPageService {
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  public getProductData(id: number): Observable<unknown> {
    const url = `${this.apiUrl}products/backend?prod_id=${id}`;
    return this.http.get(url);
  }
  public getSellerList(id: number): Observable<unknown> {
    const url = `${this.apiUrl}productseller/backend?prod_id=${id}`;
    return this.http.get(url);
  }
}
