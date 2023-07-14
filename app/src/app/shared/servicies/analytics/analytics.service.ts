import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {
    console.log('analytics service initialized');
  }

  public getAnalyticsData(seller_name: string): Observable<any> {
    const url = `${this.apiUrl}analytics/productanalytics?seller_name=${seller_name}`;
    return this.http.get<any>(url);
  }

  public getAllProducts(seller_name: string): Observable<any> {
    const url = `${this.apiUrl}analytics/allproductanalytics?seller_name=${seller_name}`;
    return this.http.get<any>(url);
  }

  public getConversionRate(seller_name: string): Observable<any> {
    const url = `${this.apiUrl}analytics/conversionrate?seller_name=${seller_name}`;
    return this.http.get<any>(url);
  }

  public getCategoryPercentage(seller_name: string): Observable<any> {
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
}
