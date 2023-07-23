/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {
    console.log('analytics service initialized');
  }

  public getAnalyticsData(seller_name: string | undefined): Observable<any> {
    const url = `${this.apiUrl}analytics/productanalytics?seller_name=${seller_name}`;
    return this.http.get<any>(url);
  }

  public getAllProducts(seller_name: string | undefined): Observable<any> {
    const data = {
      seller_name: seller_name,
    };
    const url = `${this.apiUrl}analytics/allproductanalytics/`;
    return this.http.post<any>(url, data);
  }

  public getConversionRate(seller_name: string | undefined): Observable<any> {
    const url = `${this.apiUrl}analytics/conversionrate?seller_name=${seller_name}`;
    return this.http.get<any>(url);
  }

  public getCategoryPercentage(
    seller_name: string | undefined
  ): Observable<any> {
    const url = `${this.apiUrl}analytics/categorypercentage?seller_name=${seller_name}`;
    return this.http.get<any>(url);
  }

  public createAnalyticsData(data: object): void {
    const url = `${this.apiUrl}analytics/createproductanalytics/`;
    this.http.post(url, data).subscribe({
      next: response => {
        // Handle the response
        console.log(response);
        // Perform any additional actions
      },
      error: error => {
        // Handle the error
        console.log(error);
        // Perform any additional error handling
      },
    });
  }

  public getSelectedProductData(data: object): void{
    const url = `${this.apiUrl}analytics/selectedproducts/`;
    this.http.post(url, data).subscribe({
      next: response => {
        // Handle the response
        console.log(response);
        // Perform any additional actions
      },
      error: error => {
        // Handle the error
        console.log(error);
        // Perform any additional error handling
      },
    });
  }
}
