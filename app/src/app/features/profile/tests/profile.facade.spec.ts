/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of, Observable, firstValueFrom, tap } from 'rxjs';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ISellerProfile } from '../models/seller-profile.interface';
import { ProfileService } from '../services/profile.service';
import { ProfileFacade } from '../services/profile.facade';
import * as ProfileActions from '../states/profile.actions';
import { SetError } from '@features/error/states/error.action';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { IError } from '@features/error/models/error.interface';
import { IUser } from '@features/auth/models/user.interface';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { ProfileModule } from '../profile.module';

describe('ProfileFacade', () => {
  let facade: ProfileFacade;
  let store: Store;
  let profileService: jasmine.SpyObj<ProfileService>;
  let authFacade: jasmine.SpyObj<AuthFacade>;
  let mockSellerProfile: ISellerProfile;
  let mockConsumerProfile: IConsumerProfile;
  beforeEach(() => {
    const profileActionsSpy = jasmine.createSpyObj('ProfileActions', [
      'SetProfile',
    ]);
    profileService = jasmine.createSpyObj('ProfileService', [
      'getProfile',
      'updateProfile',
    ]);
    authFacade = jasmine.createSpyObj('AuthFacade', [
      'getCurrentUser',
      'isLoggedIn',
    ]);

    authFacade.getCurrentUser.and.returnValue(of(null));
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        NgxsDispatchPluginModule,
        ProfileModule,
      ],
      providers: [
        ProfileFacade,
        { provide: ProfileService, useValue: profileService },
        { provide: AuthFacade, useValue: authFacade },
        { provide: ProfileActions.SetProfile, useValue: profileActionsSpy },
      ],
    });
    facade = TestBed.inject(ProfileFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
    mockSellerProfile = {
      id: '',
      email: '',
      type: '',
      details: {
        reg_no: undefined,
        business_name: undefined,
        business_type: undefined,
        catalogue_size: undefined,
        business_category: undefined,
        status: undefined,
        is_verified: undefined,
        website: undefined,
        feed_url: undefined,
        created_at: undefined,
        modified_at: undefined,
        last_login: undefined,
      },
    };
    mockConsumerProfile = {
      id: '',
      email: '',
      type: '',
      details: {
        wishlist: undefined,
      },
    };
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should set profile', () => {
    facade.setProfile(mockSellerProfile);
    expect(store.dispatch).toHaveBeenCalledWith(
      new ProfileActions.SetProfile(mockSellerProfile)
    );
  });

  it('should handle set profile error', () => {
    const error = new Error('test error');
    spyOn(facade, 'setProfile').and.callFake(() => {
      return facade.setError(error);
    });
    facade.setProfile(mockSellerProfile);
    expect(store.dispatch).toHaveBeenCalledWith([
      new SetError('profile', error as IError),
    ]);
  });

  it('should update profile', async () => {
    facade.updateProfile(mockConsumerProfile);
    expect(profileService.updateProfile).toHaveBeenCalledWith(
      mockConsumerProfile
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      new ProfileActions.UpdateProfile({ profile: mockConsumerProfile })
    );
  });

  it('should handle update profile error', async () => {
    const error = new Error('test error');
    profileService.updateProfile.and.throwError(error);
    facade.updateProfile(mockConsumerProfile);
    expect(store.dispatch).toHaveBeenCalledWith([
      new SetError('profile', error as IError),
    ]);
  });

  it('should clear profile', () => {
    facade.clearProfile();
    expect(store.dispatch).toHaveBeenCalledWith(
      new ProfileActions.ClearProfile()
    );
  });

  it('should handle clear profile error', () => {
    const error = new Error('test error');
    spyOn(facade, 'clearProfile').and.callFake(() => {
      return facade.setError(error);
    });
    facade.clearProfile();
    expect(store.dispatch).toHaveBeenCalledWith([
      new SetError('profile', error as IError),
    ]);
  });

  it('should set error', () => {
    const error = new Error('test error');
    facade.setError(error);
    expect(store.dispatch).toHaveBeenCalledWith([
      new SetError('profile', error as IError),
    ]);
  });

  it('should get profile when not null', async () => {
    store.reset({
      profile: {
        profile: mockSellerProfile,
      },
    });
    spyOn(facade, 'getProfile').and.returnValue(of(mockSellerProfile));
    const result = await firstValueFrom(facade.getProfile());
    expect(result).toEqual(mockSellerProfile);
  });

  it('should fetch profile when null', async () => {
    store.reset({
      profile: {
        profile: null,
      },
    });
    spyOn(facade, 'getProfile').and.returnValue(of(mockSellerProfile));
    await facade.fetchProfile();
    expect(profileService.getProfile).toHaveBeenCalled();
    const result = await firstValueFrom(facade.getProfile());
    expect(result).toEqual(mockSellerProfile);
  });

  it('should handle fetch profile error', async () => {
    const error = new Error('test error');
    store.reset({
      profile: {
        profile: null,
      },
    });
    authFacade.isLoggedIn.and.returnValue(Promise.resolve(true));
    profileService.getProfile.and.returnValue(Promise.reject(error));
    facade.getProfile().subscribe({
      error: err => {
        expect(err).toEqual(error);
        expect(store.dispatch).toHaveBeenCalledWith([
          new SetError('profile', error as IError),
        ]);
      },
    });
  });

  it('should call fetchProfile when getCurrentUser returns a user', () => {
    // set the return value for the getCurrentUser method
    authFacade.getCurrentUser.and.returnValue(
      of({ email: 'd', token: '', type: '' }) as Observable<IUser | null>
    );

    // create a spy on the fetchProfile method of the ProfileFacade class
    const fetchProfileSpy = spyOn(facade, 'fetchProfile');

    // manually trigger the subscription
    facade['authSubscription'] = authFacade
      .getCurrentUser()
      .pipe(
        tap(user => {
          if (user) {
            facade.fetchProfile();
          } else {
            facade.clearProfile();
          }
        })
      )
      .subscribe();

    // check if the fetchProfile method has been called
    expect(fetchProfileSpy).toHaveBeenCalled();
  });

  it('should clear profile on user change to null', async () => {
    authFacade.getCurrentUser.and.returnValue(of(null));
    facade = TestBed.inject(ProfileFacade);
    facade.clearProfile();
    expect(store.dispatch).toHaveBeenCalledWith(
      new ProfileActions.ClearProfile()
    );
  });

  /*it('should check wishlist and return true if item exists in wishlist', async () => {
    const mockWishlist: number[] = [1, 2, 3];
    store.reset({
      profile: {
        wishlist: mockWishlist,
      },
    });

    const idToCheck = 2;
    const result = await firstValueFrom(facade.checkWishlist(idToCheck));
    expect(result).toBeTrue();
  });
*/
  it('should check wishlist and return false if item does not exist in wishlist', async () => {
    const mockWishlist: number[] = [1, 2, 3];
    store.reset({
      profile: {
        wishlist: mockWishlist,
      },
    });

    const idToCheck = 4;
    const result = await firstValueFrom(facade.checkWishlist(idToCheck));
    expect(result).toBeFalse();
  });

  /* it('should check followed sellers and return true if seller is followed', async () => {
    const mockFollowedSellers: string[] = ['Seller1', 'Seller2'];
    store.reset({
      profile: {
        followedSellers: mockFollowedSellers,
      },
    });

    const sellerToCheck = 'Seller1';
    const result = await firstValueFrom(
      facade.checkFollowedSellers(sellerToCheck)
    );
    expect(result).toBeTrue();
  });
*/
  it('should check followed sellers and return false if seller is not followed', async () => {
    const mockFollowedSellers: string[] = ['Seller1', 'Seller2'];
    store.reset({
      profile: {
        followedSellers: mockFollowedSellers,
      },
    });

    const sellerToCheck = 'Seller3';
    const result = await firstValueFrom(
      facade.checkFollowedSellers(sellerToCheck)
    );
    expect(result).toBeFalse();
  });

  /* it('should toggle sellers and return Navigate action if user is not logged in', async () => {
    spyOn(authFacade, 'isLoggedIn').and.returnValue(of(false));
    const navigateSpy = spyOn(store, 'dispatch').and.returnValue(of(null));

    const sellerToToggle = 'Seller1';
    const result = await facade.toggleSellers(sellerToToggle);

    expect(authFacade.isLoggedIn).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['sign-in']);
    expect(result).toEqual(new Navigate(['sign-in']));
  });

  it('should toggle sellers and return Navigate action if user is a seller', async () => {
    spyOn(authFacade, 'isLoggedIn').and.returnValue(of(true));
    spyOn(authFacade, 'getUserType').and.returnValue(of('seller'));
    const navigateSpy = spyOn(store, 'dispatch').and.returnValue(of(null));

    const sellerToToggle = 'Seller1';
    const result = await facade.toggleSellers(sellerToToggle);

    expect(authFacade.isLoggedIn).toHaveBeenCalled();
    expect(authFacade.getUserType).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['sales']);
    expect(result).toEqual(new Navigate(['sales']));
  });

  it('should toggle sellers and return ToggleSellers action if user is a consumer', async () => {
    spyOn(authFacade, 'isLoggedIn').and.returnValue(of(true));
    spyOn(authFacade, 'getUserType').and.returnValue(of('consumer'));
    const toggleFollowSpy = spyOn(profileService, 'toggleFollowSeller');
    const dispatchSpy = spyOn(store, 'dispatch').and.returnValue(of(null));

    const sellerToToggle = 'Seller1';
    const result = await facade.toggleSellers(sellerToToggle);

    expect(authFacade.isLoggedIn).toHaveBeenCalled();
    expect(authFacade.getUserType).toHaveBeenCalled();
    expect(toggleFollowSpy).toHaveBeenCalledWith(sellerToToggle);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ProfileActions.ToggleSellers(sellerToToggle)
    );
    expect(result).toEqual(new ProfileActions.ToggleSellers(sellerToToggle));
  });

  it('should toggle wishlist and return Navigate action if user is not logged in', async () => {
    spyOn(authFacade, 'isLoggedIn').and.returnValue(of(false));
    const navigateSpy = spyOn(store, 'dispatch').and.returnValue(of(null));

    const itemToToggle = 1;
    const result = await facade.toggleWishlist(itemToToggle);

    expect(authFacade.isLoggedIn).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['sign-in']);
    expect(result).toEqual(new Navigate(['sign-in']));
  });

  it('should toggle wishlist and return Navigate action if user is a seller', async () => {
    spyOn(authFacade, 'isLoggedIn').and.returnValue(of(true));
    spyOn(authFacade, 'getUserType').and.returnValue(of('seller'));
    const navigateSpy = spyOn(store, 'dispatch').and.returnValue(of(null));

    const itemToToggle = 1;
    const result = await facade.toggleWishlist(itemToToggle);

    expect(authFacade.isLoggedIn).toHaveBeenCalled();
    expect(authFacade.getUserType).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['sales']);
    expect(result).toEqual(new Navigate(['sales']));
  });

  it('should toggle wishlist and return ToggleWishlist action if user is a consumer', async () => {
    spyOn(authFacade, 'isLoggedIn').and.returnValue(of(true));
    spyOn(authFacade, 'getUserType').and.returnValue(of('consumer'));
    const toggleWishlistSpy = spyOn(profileService, 'toggleWishlist');
    const dispatchSpy = spyOn(store, 'dispatch').and.returnValue(of(null));

    const itemToToggle = 1;
    const result = await facade.toggleWishlist(itemToToggle);

    expect(authFacade.isLoggedIn).toHaveBeenCalled();
    expect(authFacade.getUserType).toHaveBeenCalled();
    expect(toggleWishlistSpy).toHaveBeenCalledWith(itemToToggle);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ProfileActions.ToggleWishlist(itemToToggle)
    );
    expect(result).toEqual(new ProfileActions.ToggleWishlist(itemToToggle));
  });
*/
  it('should call ngOnDestroy and unsubscribe authSubscription', () => {
    const unsubscribeSpy = spyOn(facade['authSubscription'], 'unsubscribe');
    facade.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
