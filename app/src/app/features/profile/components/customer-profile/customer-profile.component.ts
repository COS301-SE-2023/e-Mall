import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileFacade } from '../../services/profile.facade';
import { ISellerProfile } from '../../models/seller-profile.interface';
import { IConsumerProfile } from '../../models/consumer-profile.interface';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent {

  customerprofileForm: FormGroup;
  profile$: Observable<ISellerProfile | IConsumerProfile | null>;

  constructor(private router: Router,public profileFacade: ProfileFacade) { 
    this.customerprofileForm = new FormGroup({
      username: new FormControl(),
      email: new FormControl(), 
      details: new FormControl(), 
    });

    this.profile$ = this.profileFacade.getProfile();
  
  }

  goToWishlist() {
    
    this.router.navigate(['/wishlist']);
  }

  goToConstruction(){
    this.router.navigate(['/construction']);
  }

  public signOut(): void {
    this.router.navigate(['sign-out']);
  }

}
