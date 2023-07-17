/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { lastValueFrom, shareReplay, take } from 'rxjs';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ISellerProfile } from '../models/seller-profile.interface';

@Injectable()
export class ProfileService {
  private apiUrl = '/api/profile/';
  constructor(private http: HttpClient) {}
  async getProfile(): Promise<ISellerProfile | IConsumerProfile | null> {
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
    )) as HttpResponse<ISellerProfile | IConsumerProfile | null>;
    return res.body;
  }
  async updateProfile(
    data: any
  ): Promise<ISellerProfile | IConsumerProfile | null> {
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
    )) as HttpResponse<ISellerProfile | IConsumerProfile | null>;
    return res.body;
  }
}
