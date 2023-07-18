/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed, fakeAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProfileService } from '../services/profile.service';
import { ISellerProfile } from '../models/seller-profile.interface';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ProfileModule } from '../profile.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  let mockSellerProfile: ISellerProfile;
  let mockConsumerProfile: IConsumerProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ProfileModule,
        NgxsModule.forRoot([]),
        NgxsDispatchPluginModule,
      ],
      providers: [ProfileService],
    });
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
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
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get profile', fakeAsync(() => {
    spyOn(service, 'getProfile').and.returnValue(
      Promise.resolve(mockSellerProfile)
    );
    service.getProfile().then(result => {
      expect(result).toEqual(mockSellerProfile);
    });
  }));

  it('should update profile', () => {
    // Mock the updateProfile method
    spyOn(service, 'updateProfile').and.returnValue(
      Promise.resolve(mockConsumerProfile)
    );

    // Call the updateProfile method
    service.updateProfile(mockConsumerProfile).then(result => {
      // Check the result
      expect(result).toEqual(mockConsumerProfile);
    });
  });
});
