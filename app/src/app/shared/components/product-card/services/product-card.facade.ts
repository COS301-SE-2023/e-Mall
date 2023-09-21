/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Injectable()
export class ProductCardFacade {
  isLoading = new BehaviorSubject(false);
  loading = false;
  constructor() {
    console.log('hiiiiii');
    this.isLoading.pipe(debounceTime(100)).subscribe(isLoading => {
      this.loading = isLoading;
      console.log('loading: ', this.loading);
    });
  }

  async startLoading() {
    this.isLoading.next(true);
  }
  async stopLoading() {
    this.isLoading.next(false);
  }
}
