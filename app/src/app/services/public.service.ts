import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  api_url = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}

  getMessages() {
    return this.http.get(this.api_url);
  }
}
