import { AuthFacade } from '@features/auth/services/auth.facade';
import { Router } from '@angular/router';
import { WishlistSelectors } from '../states/wishlist.selector';
import { WishlistService } from './wishlist.service';
import * as WishlistActions from '../states/wishlist.actions';
import { Select } from '@ngxs/store';
import { IProduct } from '@app/shared/models/product/product.interface';
import { Observable, shareReplay, tap, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { IError } from '@features/error/models/error.interface';
import { SetError } from '@features/error/states/error.action';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

@Injectable()
export class WishlistFacade implements OnDestroy {
  @Select(WishlistSelectors.getWishlist)
  private wishlist$!: Observable<IProduct[] | null>;
  private authSubscription: Subscription;

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private wishlistService: WishlistService
  ) {
    console.log('Wishlist facade initialized');
    this.authSubscription = this.authFacade
      .getCurrentUser()
      .pipe(
        tap(user => {
          if (user) {
            this.fetchWishlist();
          } else {
            this.clearWishlist();
          }
        })
      )
      .subscribe();
  }

  @Dispatch()
  setWishlist(products: IProduct[]) {
    try {
      return new WishlistActions.SetWishlist(products);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  addProductToWishlist(product: IProduct) {
    try {
      this.wishlistService.toggleWishlist(product.id);
      return new WishlistActions.AddProductToWishlist(product);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  removeProductFromWishlist(product: IProduct) {
    try {
      this.wishlistService.removeProductFromWishlist(product.id);
      return new WishlistActions.RemoveProductFromWishlist(product);
    } catch (error) {
      return this.setError(error);
    }
  }
  @Dispatch()
  setError(error: any) {
    return [new SetError('combo', error as IError)];
  }

  @Dispatch()
  clearWishlist() {
    try {
      return new WishlistActions.ClearWishlist();
    } catch (error) {
      return this.setError(error);
    }
  }

  async fetchWishlist() {
    try {
      const res = await this.wishlistService.getWishlistedProducts();
      if (res != null) this.setWishlist(res);
    } catch (error) {
      this.setError(error);
    }
  }

  getWishlist(): Observable<IProduct[] | null> {
    return this.wishlist$.pipe(
      tap(async wishlist => {
        if (wishlist == null && (await this.authFacade.isLoggedIn())) {
          this.fetchWishlist();
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
