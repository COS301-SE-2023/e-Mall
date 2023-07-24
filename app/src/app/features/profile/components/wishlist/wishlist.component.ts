import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileFacade } from '../../services/profile.facade';
import { ISellerProfile } from '../../models/seller-profile.interface';
import { IConsumerProfile } from '../../models/consumer-profile.interface';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
//import { AuthFacade } from '@app/features/auth/services/auth.facade';
//import { IUser } from '@app/features/auth/models/user.interface';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  bool = true;
  //isAuthenticated: Observable<IUser | null>;
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

  /*constructor(
    private router: Router,
    /*private authFacade: AuthFacade) {
      //this.isAuthenticated = this.authFacade.getCurrentUser();
     }*/

  

  goToCustomerProfile() {
    
    this.router.navigate(['/customer-profile']);
  }

  goToConstruction(){
    this.router.navigate(['/construction']);
  }

  public signOut(): void {
    this.router.navigate(['sign-out']);
  }
}
