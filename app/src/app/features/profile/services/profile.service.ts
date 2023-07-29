/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { lastValueFrom, shareReplay, take } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Profile } from '../models/alias-profile.interface';

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
    console.log(prod_id);
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
}
