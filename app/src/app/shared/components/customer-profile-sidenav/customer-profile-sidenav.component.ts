import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-profile-sidenav',
  templateUrl: './customer-profile-sidenav.component.html',
  styleUrls: ['./customer-profile-sidenav.component.scss']
})
export class CustomerProfileSidenavComponent {

  constructor(private router: Router){}

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
