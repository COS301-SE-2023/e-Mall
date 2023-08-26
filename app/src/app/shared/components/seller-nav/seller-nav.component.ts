import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seller-nav',
  templateUrl: './seller-nav.component.html',
  styleUrls: ['./seller-nav.component.scss'],
  providers: [ProfileFacade],
})
export class SellerNavComponent implements OnInit, OnDestroy {
  
  username: string | undefined;
  currentPage = 'inventory'; // Set a default value for the current page
  // Set a default value for the current page
  private profileSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private profileFacade: ProfileFacade,
    private authFacade: AuthFacade
  ) {}

  navigateTo(page: string): void {
    this.currentPage = page;
    setTimeout(() => {
      this.router.navigate([`/${page}`]);
    }, 0);
  }
  public signOut(): void {
    this.authFacade.signOut();
  }

  ngOnInit(): void {
    this.profileSubscription = this.profileFacade
      .getProfile()
      .subscribe(profile => {
        if (profile && 'username' in profile) {
          this.username = profile.username;
          this.router.events.subscribe(() => {
            this.currentPage = this.router.url.slice(1);
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}
