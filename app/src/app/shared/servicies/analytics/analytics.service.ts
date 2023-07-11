import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

    public createAnalyticsData(data: object): Observable<any> {
        const url = `${this.apiUrl}analytics/createproductanalytics`;
        return this.http.post<any>(url, data);
    }
}