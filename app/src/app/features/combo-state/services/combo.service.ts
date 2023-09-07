/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map, shareReplay, take } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ICombo } from '../models/combo.interface';

@Injectable()
export class ComboService {
  private apiUrl = '/api/combos/';
  constructor(private http: HttpClient) {}

  async getCombos(): Promise<any> {
    const url = `${this.apiUrl}get/`;

    const response = await lastValueFrom(
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

    // Check if the response status is OK (200) before accessing the body
    if (response.status === 200) {
      return response.body as any;
    } else {
      throw new Error('Failed to fetch combo data');
    }
  }

  async updateCombo(data: any): Promise<any> {
    const url = `${this.apiUrl}update/`;

    const res = await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1), shareReplay(1))
    );
    return res.body;
  }

  async updateUsers(data: any): Promise<any> {
    const url = `${this.apiUrl}update_user/`;

    const res = await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1), shareReplay(1))
    );
    return res.body;
  }

  async deleteUser(data: any): Promise<any> {
    const url = `${this.apiUrl}delete/`;
    const res = await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1), shareReplay(1))
    );
    return res.body;
  }

  async createCombo(data: any): Promise<any> {
    const url = `${this.apiUrl}create/`;
    const res = await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1), shareReplay(1))
    );
    return res.body;
  }

  async removeProduct(data: any): Promise<any> {
    const url = `${this.apiUrl}remove_product/`;
    const res = await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1), shareReplay(1))
    );
    return res.body;
  }

  async editCombo(data: any): Promise<any> {
    const url = `${this.apiUrl}edit/`;
    const res = await lastValueFrom(
      this.http
        .post(url, data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'true'),
          observe: 'response',
        })
        .pipe(take(1), shareReplay(1))
    );
    return res.body;
  }
}
