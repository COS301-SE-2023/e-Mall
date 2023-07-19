/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed, fakeAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProfileService } from '../services/profile.service';
import { ISellerProfile } from '../models/seller-profile.interface';
import { ProfileModule } from '../profile.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { Profile } from '../models/alias-profile.interface';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  let mockSellerProfile: ISellerProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ProfileModule,
        NgxsModule.forRoot([]),
        NgxsDispatchPluginModule,
        HttpClientTestingModule,
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
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get profile', fakeAsync(() => {
    service.getProfile().then(result => {
      expect(result).toEqual(mockSellerProfile);
    });

    const req = httpMock.expectOne(req => {
      return req.url.endsWith('/api/profile/get/');
    });
    expect(req.request.method).toBe('POST');
    req.flush(mockSellerProfile);
  }));

  it('should update profile', () => {
    const mockProfile: Profile = {
      id: '1',
      email: 'test@example.com',
      type: 'consumer',
      details: {},
    };

    service.updateProfile(mockProfile).then(profile => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne('/api/profile/update/');
    expect(req.request.method).toBe('POST');
    req.flush(mockProfile);
  });
});
