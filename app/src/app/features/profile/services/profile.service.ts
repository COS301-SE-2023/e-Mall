/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import {
  Observable,
  firstValueFrom,
  lastValueFrom,
  map,
  shareReplay,
  take,
} from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Profile } from '../models/alias-profile.interface';
import { ISellerCard } from '../models/seller-card.interface';
import { IProduct } from '@shared/models/product/product.interface';

@Injectable()
export class ProfileService {
  private apiUrl = '/api/profile/';
  constructor(private http: HttpClient) {}

  async getProfile(): Promise<Profile> {
    const url = `${this.apiUrl}get/`;
    const res = (await lastValueFrom(
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
    )) as HttpResponse<Profile>;
    return res.body;
  }
  async updateProfile(data: any): Promise<Profile> {
    const url = `${this.apiUrl}update/`;
    const res = (await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1), shareReplay(1))
    )) as HttpResponse<Profile>;
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

  async toggleFollowSeller(seller_name: string): Promise<void> {
    const url = `${this.apiUrl}updateFollowedSellers/`;
    await lastValueFrom(
      this.http
        .post(
          url,
          { seller_name: seller_name },
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

  fetchFollowedSellerDetails(): Observable<ISellerCard[] | null> {
    const url = `${this.apiUrl}fetchFollowedSellerDetails/`;
    return this.http
      .post<ISellerCard[]>(
        url,
        {},
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        }
      )
      .pipe(map(response => response.body));
  }

  async fetchRecommendedProducts(): Promise<IProduct[]> {
    console.log('fetchRecommendedProducts start');
    await this.updateRecommendedProducts();
    const url = `${this.apiUrl}fetchRecommendedProducts/`;

    const response = await lastValueFrom(
      this.http
        .post<IProduct[]>(
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
    console.log('fetchRecommendedProducts end');

    return response.body || [];
  }

  async updateRecommendedProducts() {
    await this.updateDB();
    const url = `${this.apiUrl}updateRecommendedProducts/`;

    return await firstValueFrom(
      this.http.post(
        url,
        {},
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        }
      )
    );
  }

  async updateDB() {
    const url = `http://localhost:3000/api/custanalytics/predicted_matrix/`;
    return firstValueFrom(this.http.post(url, {}));
  }
}
