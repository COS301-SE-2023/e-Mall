import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductPageService {

  private apiUrl = 'http://localhost:3000/api/products/frontend';

  constructor(private http: HttpClient) { }

  getProductData(): Observable<any> {

    const url = `${this.apiUrl}?prod_id =1`; 
    return this.http.get(url);
  }
}
