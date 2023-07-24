import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    /*private authFacade: AuthFacade*/) {
      //this.isAuthenticated = this.authFacade.getCurrentUser();
     }

  

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
