/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { WishlistFacade } from '../services/wishlist.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wishlist-state',
  templateUrl: './wishlist-state.component.html',
  styleUrls: ['./wishlist-state.component.scss'],
})
export class WishlistComponent {
  wishlist$: Observable<any>;
  constructor(public wishlistFacade: WishlistFacade) {
    this.wishlist$ = this.wishlistFacade.getWishlist();
    // this.wishlistFacade()
  }
}
