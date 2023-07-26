import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SellerService } from '@shared/servicies/seller/seller.service';

@Injectable({
  providedIn: 'root',
})
export class SellerDataResolver implements Resolve<any> {
  constructor(private sellerService: SellerService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const seller_id = route.queryParamMap.get('seller_id');
    if (seller_id) {
      const data = { seller_id };
      return this.sellerService.getSellerData(data);
    } else {
      return of(null);
    }
  }
}
