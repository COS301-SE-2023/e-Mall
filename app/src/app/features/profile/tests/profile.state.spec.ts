import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ProfileState } from '../states/profile.state';
import * as ProfileActions from '../states/profile.actions';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ISellerProfile } from '../models/seller-profile.interface';

describe('ProfileState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ProfileState])],
    });

    store = TestBed.inject(Store);
  });

  it('should set profile', () => {
    const mockProfile: IConsumerProfile = {
      id: '1',
      email: 'test@example.com',
      type: 'consumer',
      details: {},
    };

    store.dispatch(new ProfileActions.SetProfile(mockProfile));
    const profile = store.selectSnapshot(state => state.profile.profile);
    expect(profile).toEqual(mockProfile);
  });

  it('should update profile', () => {
    const mockProfile: IConsumerProfile = {
      id: '1',
      email: 'test@example.com',
      type: 'consumer',
      details: {},
    };

    store.dispatch(new ProfileActions.SetProfile(mockProfile));

    const updatedProfile: Partial<IConsumerProfile> = {
      email: 'updated@example.com',
    };

    store.dispatch(
      new ProfileActions.UpdateProfile({ profile: updatedProfile })
    );
    const profile = store.selectSnapshot(state => state.profile.profile);
    expect(profile).toEqual({ ...mockProfile, ...updatedProfile });
  });

  it('should clear profile', () => {
    const mockProfile: ISellerProfile = {
      id: '1',
      email: 'test@example.com',
      type: 'seller',
      details: {},
    };

    store.dispatch(new ProfileActions.SetProfile(mockProfile));
    store.dispatch(new ProfileActions.ClearProfile());
    const profile = store.selectSnapshot(state => state.profile.profile);
    expect(profile).toBeNull();
  });
});
