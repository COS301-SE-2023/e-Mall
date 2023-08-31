import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map, shareReplay, take } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ICombo, IComboResponse } from '../models/combo.interface';

@Injectable()
export class ComboService {
    private apiUrl = '/api/combos/';
    constructor(private http: HttpClient) { }

    async getCombos(): Promise<IComboResponse> {
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
        )) as HttpResponse<IComboResponse>;
        if (res && res.body) {
              return res.body;
            } else {
              return []; // Return an empty array or handle the null case accordingly
            }
    }
    
    async updateCombo(data: any): Promise<any> {
        const url = `${this.apiUrl}update/`;
        const res = (await lastValueFrom(
            this.http
                .post(url, data, {
                    headers: new HttpHeaders()
                        .set('Content-Type', 'application/json')
                        .set('Authorization', 'true'),
                    observe: 'response',
                })
        )) as HttpResponse<ICombo>;
        return res.body;
    }

    async updateUsers(data: any): Promise<any> {
        const url = `${this.apiUrl}update_user/`;
        const res = (await lastValueFrom(
            this.http
                .post(url, data, {
                    headers: new HttpHeaders()
                        .set('Content-Type', 'application/json')
                        .set('Authorization', 'true'),
                    observe: 'response',
                })
        ))
        return res.body;
    }

    async delete(data: any): Promise<any> {
        const url = `${this.apiUrl}delete/`;
        const res = (await lastValueFrom(
            this.http
                .post(url, data, {
                    headers: new HttpHeaders()
                        .set('Content-Type', 'application/json')
                        .set('Authorization', 'true'),
                    observe: 'response',
                })
        ))
        return res.body;
    }
}