/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { lastValueFrom, shareReplay, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class WishlistService {
  private apiUrl = '/api/profile/';
  constructor(private http: HttpClient) {}

  async getWishlistedProducts(): Promise<any> {
    const url = `${this.apiUrl}getWishlistedProducts/`;
    const res = await lastValueFrom(
      this.http
        .post(
          url,
          {},
          {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/json')
              .set('Authorization', 'true'),
            observe: 'response',
          }
        )
        .pipe(take(1), shareReplay(1))
    );
    return res.body;
  }
  async toggleWishlist(prod_id: number): Promise<void> {
    const url = `${this.apiUrl}updateWishlist/`;
    await lastValueFrom(
      this.http
        .post(
          url,
          { prod_id: prod_id },
          {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/json')
              .set('Authorization', 'true'),
            observe: 'response',
          }
        )
        .pipe(take(1), shareReplay(1))
    );
  }

  async removeProductFromWishlist(prod_id: number): Promise<void> {
    const url = `${this.apiUrl}removeProductFromWishlist/`;
    await lastValueFrom(
      this.http
        .post(
          url,
          { prod_id: prod_id },
          {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/json')
              .set('Authorization', 'true'),
            observe: 'response',
          }
        )
        .pipe(take(1), shareReplay(1))
    );
  }
}
