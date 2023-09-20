/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { IError } from '@features/error/models/error.interface';
import { SetError } from '@features/error/states/error.action';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import {
  Observable,
  tap,
  Subscription,
  map,
  of,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ISellerProfile } from '../models/seller-profile.interface';
import { ProfileSelectors } from '../states/profile.selector';
import { ProfileService } from './profile.service';
import * as ProfileActions from '../states/profile.actions';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { Profile } from '../models/alias-profile.interface';
import { Router } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { IProduct } from '@shared/models/product/product.interface';

@Injectable()
export class ProfileFacade implements OnDestroy {
  @Select(ProfileSelectors.getProfile)
  private profile$!: Observable<Profile>;
  @Select(ProfileSelectors.getWishlist)
  private wishlist$!: Observable<number[]>;
  @Select(ProfileSelectors.getFollowedSellers)
  public followedSellers$!: Observable<string[]>;
  @Select(ProfileSelectors.getRecommendedProducts)
  public recommendedProducts$!: Observable<IProduct[]>;
  private authSubscription: Subscription;
  private profileSubs = new Subscription();

  constructor(
    private profileService: ProfileService,
    private authFacade: AuthFacade,
    private router: Router
  ) {
    console.log('Profile facade initialized');

    this.authSubscription = this.authFacade
      .getCurrentUser()
      .pipe(
        debounceTime(500),
        tap(async user => {
          if (user) {
            await this.fetchProfile();
            this.init();
          } else {
            if (this.profileSubs) {
              this.profileSubs.unsubscribe();
            }
            this.clearProfile();
          }
        })
      )
      .subscribe();
  }
  init() {
    this.profileSubs = this.profile$
      .pipe(
        distinctUntilChanged((prev, curr) => {
          return !(prev === null && curr !== null);
        })
      )
      .subscribe(profile => {
        if (profile) {
          if (profile.type === 'seller') {
            return;
          }
          this.fetchRecommendedProducts();
        }
      });
  }
  @Dispatch()
  setProfile(profile: ISellerProfile | IConsumerProfile) {
    try {
      return new ProfileActions.SetProfile(profile);
    } catch (error) {
      return this.setError(error);
    }
  }
  @Dispatch()
  setRecommendedProducts(products: IProduct[]) {
    try {
      return new ProfileActions.SetRecommendedProducts(products);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  updateProfile(profile: Partial<IConsumerProfile | ISellerProfile>) {
    try {
      this.profileService.updateProfile(profile);
      return new ProfileActions.UpdateProfile({ profile });
    } catch (error) {
      return this.setError(error);
    }
  }
  @Dispatch()
  clearProfile() {
    try {
      return new ProfileActions.ClearProfile();
    } catch (error) {
      return this.setError(error);
    }
  }
  @Dispatch()
  setError(error: any) {
    return [new SetError('profile', error as IError)];
  }

  getProfile(): Observable<Profile> {
    return this.profile$;
  }


  async fetchProfile() {
    try {
      const res = await this.profileService.getProfile();
      if (res != null) this.setProfile(res);
    } catch (error) {
      this.setError(error);
    }
  }

  async fetchRecommendedProducts() {
    try {
      const res = await this.profileService.fetchRecommendedProducts();
      if (res != null) this.setRecommendedProducts(res);
    } catch (error) {
      this.setError(error);
    }
  }

  checkWishlist(id: number): Observable<boolean> {
    return this.wishlist$.pipe(
      map(wishlist => {
        return wishlist.includes(Number(id));
      })
    );
  }

  checkFollowedSellers(name: string): Observable<boolean> {
    return this.followedSellers$.pipe(
      map(followedSellers => {
        return followedSellers.includes(name);
      })
    );
  }

  @Dispatch()
  async toggleSellers(name: string) {
    if (!(await this.authFacade.isLoggedIn())) {
      this.setError('You must be logged in to follow sellers');
      return new Navigate(['sign-in']);
    } else if ((await this.authFacade.getUserType()) === 'seller') {
      this.setError('Sellers cannot follow sellers');
      return new Navigate(['sales']);
    } else {
      try {
        this.profileService.toggleFollowSeller(name);
        return new ProfileActions.ToggleSellers(name);
      } catch (error) {
        return this.setError(error);
      }
    }
  }

  @Dispatch()
  async toggleWishlist(id: number) {
    if (!(await this.authFacade.isLoggedIn())) {
      this.setError('You must be logged in to add to wishlist');
      return new Navigate(['sign-in']);
    } else if ((await this.authFacade.getUserType()) === 'seller') {
      this.setError('Sellers cannot add to wishlist');
      return new Navigate(['sales']);
    } else {
      try {
        this.profileService.toggleWishlist(id);
        return new ProfileActions.ToggleWishlist(id);
      } catch (error) {
        return this.setError(error);
      }
    }
  }

  @Dispatch()
  async removeProductFromWishlist(id: number) {
    if (!(await this.authFacade.isLoggedIn())) {
      this.setError('You must be logged in to remove from wishlist');
      return new Navigate(['sign-in']);
    } else if ((await this.authFacade.getUserType()) === 'seller') {
      this.setError('Sellers cannot remove from wishlist');
      return new Navigate(['sales']);
    } else {
      try {
        this.profileService.removeProductFromWishlist(id);
        return new ProfileActions.RemoveProductFromWishlist(id);
      } catch (error) {
        return this.setError(error);
      }
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.profileSubs) {
      this.profileSubs.unsubscribe();
    }
  }

  fetchFollowedSellerDetails() {
    try {
      this.profileService.fetchFollowedSellerDetails();
      return;
    } catch (error) {
      this.setError(error);
      return of(null);
    }
  }
}
