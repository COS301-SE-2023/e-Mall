import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent {

  constructor(private router: Router) { }

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
