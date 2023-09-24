/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, debounceTime } from 'rxjs';

@Injectable()
export class ProductCardFacade implements OnDestroy {
  isLoading = new BehaviorSubject(false);
  loading = false;
  count = 0;
  isLoadingSubs = new Subscription();
  constructor() {
    this.isLoadingSubs = this.isLoading
      .pipe(debounceTime(100))
      .subscribe(isLoading => {
        this.loading = isLoading;
        // console.log('loading: ', this.loading);
      });
  }
  ngOnDestroy(): void {
    this.isLoadingSubs.unsubscribe();
  }

  async startLoading() {
    this.isLoading.next(true);
  }
  async stopLoading() {
    this.isLoading.next(false);
  }
}
