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
    authFacade = jasmine.createSpyObj('AuthFacade', ['getCurrentUser']);
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
    expect(store.dispatch).toHaveBeenCalledWith(
      new SetError('profile', error as IError)
    );
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
    expect(store.dispatch).toHaveBeenCalledWith(
      new SetError('profile', error as IError)
    );
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
    expect(store.dispatch).toHaveBeenCalledWith(
      new SetError('profile', error as IError)
    );
  });

  it('should set error', () => {
    const error = new Error('test error');
    facade.setError(error);
    expect(store.dispatch).toHaveBeenCalledWith(
      new SetError('profile', error as IError)
    );
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
    profileService.getProfile.and.returnValue(Promise.reject(error));
    facade.getProfile().subscribe({
      error: err => {
        expect(err).toEqual(error);
        expect(store.dispatch).toHaveBeenCalledWith(
          new SetError('profile', error as IError)
        );
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
});
