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
  public isMenuCollapsed = true;

  constructor(private router: Router, private authFacade: AuthFacade) {
    this.currentPage = 'customer-profile';
  }

  goToCustomerProfile() {
    this.isMenuCollapsed = true;
    this.router.navigate(['/customer-profile']);
  }

  goToWishlist() {
    this.isMenuCollapsed = true;
    this.router.navigate(['/wishlist']);
  }

  goToConstruction() {
    this.router.navigate(['/construction']);
  }

  public signOut(): void {
    this.authFacade.signOut();
  }

  navigateTo(page: string): void {
    this.isMenuCollapsed = true;
    this.currentPage = page;
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

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    console.log(this.isMenuCollapsed)
  }

  ionViewWillEnter(){
    this.isMenuCollapsed = true;
    console.log("here");
  }
}
