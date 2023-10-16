/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProfileService } from '@features/profile/services/profile.service';
import { Profile } from '../models/alias-profile.interface';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService],
    });
    profileService = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure there are no outstanding HTTP requests.
    httpMock.verify();
  });

  it('should be created', () => {
    expect(profileService).toBeTruthy();
  });

  it('should make a POST request to getProfile()', () => {
    // Mock response data
    const mockProfile: Profile = {
      id: '1',
      email: 'mock@gmail.com',
      type: 'type1',
      details: {},
    };

    // Make the API call
    profileService.getProfile().then(result => {
      expect(result).toEqual(mockProfile);
    });

    // Set up the expected request
    const req = httpMock.expectOne('/api/profile/get/');
    expect(req.request.method).toBe('POST');

    // Provide the mock response data
    req.flush(mockProfile);
  });

  it('should make a POST request to updateProfile()', () => {
    // Mock request data
    const mockData: any = {
      /* ... Define your mock data here ... */
    };

    // Mock response data
    const mockProfile: Profile = {
      id: '1',
      email: 'mock@gmail.com',
      type: 'type1',
      details: {},
    };

    // Make the API call
    profileService.updateProfile(mockData).then(result => {
      expect(result).toEqual(mockProfile);
    });

    // Set up the expected request
    const req = httpMock.expectOne('/api/profile/update/');
    expect(req.request.method).toBe('POST');

    // Provide the mock response data
    req.flush(mockProfile);
  });

  it('should make a POST request to toggleWishlist()', () => {
    // Mock request data
    const prod_id = 123;

    // Make the API call
    profileService.toggleWishlist(prod_id).then(() => {
      // No need to check the response for this method.
    });

    // Set up the expected request
    const req = httpMock.expectOne('/api/profile/updateWishlist/');
    expect(req.request.method).toBe('POST');

    // Provide an empty response to complete the request
    req.flush(null);
  });

  it('should make a POST request to toggleFollowSeller()', () => {
    // Mock request data
    const seller_name = 'Seller Name';

    // Make the API call
    profileService.toggleFollowSeller(seller_name).then(() => {
      // No need to check the response for this method.
    });

    // Set up the expected request
    const req = httpMock.expectOne('/api/profile/updateFollowedSellers/');
    expect(req.request.method).toBe('POST');

    // Provide an empty response to complete the request
    req.flush(null);
  });
});
