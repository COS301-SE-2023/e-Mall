/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { IError } from '@features/error/models/error.interface';
import { SetError } from '@features/error/states/error.action';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable, shareReplay, tap, Subscription } from 'rxjs';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ISellerProfile } from '../models/seller-profile.interface';
import { ProfileSelectors } from '../states/profile.selector';
import { ProfileService } from './profile.service';
import * as ProfileActions from '../states/profile.actions';
import { AuthFacade } from '@features/auth/services/auth.facade';

@Injectable()
export class ProfileFacade implements OnDestroy {
  @Select(ProfileSelectors.getProfile)
  private profile$!: Observable<ISellerProfile | IConsumerProfile | null>;
  private authSubscription: Subscription;
  constructor(
    private profileService: ProfileService,
    private authFacade: AuthFacade
  ) {
    console.log('Profile facade initialized');
    this.authSubscription = this.authFacade
      .getCurrentUser()
      .pipe(
        tap(user => {
          console.log('Profile tap');
          if (user) {
            this.fetchProfile();
          } else {
            this.clearProfile();
          }
        })
      )
      .subscribe();
  }

  @Dispatch()
  setProfile(profile: ISellerProfile | IConsumerProfile) {
    try {
      return new ProfileActions.SetProfile(profile);
    } catch (error) {
      return new SetError('profile', error as IError);
    }
  }
  @Dispatch()
  updateProfile(profile: Partial<IConsumerProfile | ISellerProfile>) {
    try {
      this.profileService.updateProfile(profile);
      return new ProfileActions.UpdateProfile({ profile });
    } catch (error) {
      return new SetError('profile', error as IError);
    }
  }
  @Dispatch()
  clearProfile() {
    try {
      return new ProfileActions.ClearProfile();
    } catch (error) {
      return new SetError('profile', error as IError);
    }
  }
  @Dispatch()
  setError(error: any) {
    return new SetError('profile', error as IError);
  }
  getProfile(): Observable<ISellerProfile | IConsumerProfile | null> {
    return this.profile$.pipe(
      tap(async profile => {
        if (profile == null) {
          await this.fetchProfile();
        }
      }),
      shareReplay(1)
    );
  }
  async fetchProfile() {
    try {
      const res = await this.profileService.getProfile();
      if (res != null) this.setProfile(res);
    } catch (error) {
      this.setError(error);
    }
  }

  ngOnDestroy() {
    console.log('profile facade destroyed');
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
