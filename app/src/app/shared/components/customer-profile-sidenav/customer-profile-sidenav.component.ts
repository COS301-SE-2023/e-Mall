import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-profile-sidenav',
  templateUrl: './customer-profile-sidenav.component.html',
  styleUrls: ['./customer-profile-sidenav.component.scss'],
  providers: [ProfileFacade],
})
export class CustomerProfileSidenavComponent implements OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() profile: any;
  currentPage: string;
  routerURL = new Subscription();

  constructor(private router: Router, private authFacade: AuthFacade) {
    console.log('profile side init');
    this.currentPage = 'customer-profile';
  }

  goToCustomerProfile() {
    this.router.navigate(['/customer-profile']);
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  goToConstruction() {
    this.router.navigate(['/construction']);
  }

  public signOut(): void {
    this.authFacade.signOut();
  }

  navigateTo(page: string): void {
   // console.log(this.currentPage);
    this.currentPage = page;
  //  console.log(this.currentPage);
    setTimeout(() => {
      this.router.navigate([`/${page}`]);
    }, 0);
  }

  ngOnInit(): void {
    this.routerURL = this.router.events.subscribe(() => {
      this.currentPage = this.router.url.slice(1);
    });
  }

  ngOnDestroy() {
    this.routerURL.unsubscribe();
  }
}
