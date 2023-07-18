/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProfileService } from '../services/profile.service';
import { ISellerProfile } from '../models/seller-profile.interface';
import { IConsumerProfile } from '../models/consumer-profile.interface';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  let mockSellerProfile: ISellerProfile;
  let mockConsumerProfile: IConsumerProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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

  //   it('should get profile', async () => {
  //     const result = await service.getProfile();
  //     expect(result).toEqual(mockSellerProfile);
  //     const req = httpMock.expectOne(req =>
  //       /\/api\/profile\/get\/$/.test(req.url)
  //     );
  //     expect(req.request.method).toBe('POST');
  //     req.flush(mockSellerProfile);
  //   });

  //   it('should update profile', async () => {
  //     const result = await service.updateProfile(mockConsumerProfile);
  //     expect(result).toEqual(mockConsumerProfile);
  //     const req = httpMock.expectOne(req =>
  //       /\/api\/profile\/update\/$/.test(req.url)
  //     );
  //     expect(req.request.method).toBe('POST');
  //     req.flush(mockConsumerProfile);
  //   });
});
