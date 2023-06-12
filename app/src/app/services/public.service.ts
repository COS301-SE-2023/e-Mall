import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  api_url = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  getMessages() {
    return this.http.get(this.api_url);
  }
  sellserSignUp() {
    const url = 'http://localhost:3000/api/seller/';
    const data = {
      username: 'test2',
      email: 'test2@test.com',
      type: 'seller',
      reg_no: '12345602',
      business_name: 'Test Business',
      business_type: 'Test Type',
      catalogue_size: 200,
      business_category: 'MICRO',
      status: 'PENDING',
      is_verified: false,
      website: 'https://www.bing2.com/',
      feed_url: 'https://www.bing2.com/',
    };
    return this.http.post(url, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
  // sellserSignIn(email: string) {
  //   const url = 'http://localhost:3000/api/seller/';
  //   return this.http.get(`${url}${email}/`);
  // }
}
