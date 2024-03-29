import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileFacade } from '../../services/profile.facade';
import { ISellerProfile } from '../../models/seller-profile.interface';
import { IConsumerProfile } from '../../models/consumer-profile.interface';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthFacade } from '@features/auth/services/auth.facade';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss'],
})
export class CustomerProfileComponent {
  customerprofileForm: FormGroup;
  profile$: Observable<ISellerProfile | IConsumerProfile | null>;

  constructor(
    private router: Router,
    public profileFacade: ProfileFacade,
    public authFacade: AuthFacade
  ) {
    this.customerprofileForm = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      details: new FormControl(),
    });

    this.profile$ = this.profileFacade.getProfile();
  }

  public goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  public goToConstruction() {
    this.router.navigate(['/construction']);
  }

  public goToEditProfile(): void {
    this.router.navigate(['edit-customer-profile']);
  }
}
