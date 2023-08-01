/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ProfileComponent } from '@features/profile/components/profile.component';
import { ProfileFacade } from '../services/profile.facade';
import { Observable, of } from 'rxjs';
import { ISellerProfile } from '../models/seller-profile.interface';
import { IConsumerProfile } from '../models/consumer-profile.interface';

// Mock ProfileFacade
class MockProfileFacade {
  getProfile(): Observable<ISellerProfile | IConsumerProfile | null> {
    // You can return a mocked profile object here if needed.
    const mockProfile: ISellerProfile = {
        id: '123',
        type: 'seller',
        email: '',
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
            wishlist: undefined,
            followed_sellers: undefined
        }
    };
    return of(mockProfile); // Return the mocked profile of type ISellerProfile
  }
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let profileFacade: ProfileFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProfileFacade, useClass: MockProfileFacade },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    profileFacade = TestBed.inject(ProfileFacade);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the profileForm', () => {
    expect(component.profileForm).toBeInstanceOf(FormGroup);
    expect(component.profileForm.controls['username']).toBeInstanceOf(FormControl);
    expect(component.profileForm.controls['email']).toBeInstanceOf(FormControl);
  });

});
