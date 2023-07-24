import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-profile-sidenav',
  templateUrl: './customer-profile-sidenav.component.html',
  styleUrls: ['./customer-profile-sidenav.component.scss']
})
export class CustomerProfileSidenavComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() profile: any;

  constructor(private router: Router){}

  goToCustomerProfile() {
    
    this.router.navigate(['/customer-profile']);
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
