/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthFacade } from '@shared/features/auth/services/auth.facade';
import { IUser } from '@shared/features/auth/models/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isAuthenticated: Observable<IUser | null>;
  isCategoryOpened = false;
  constructor(private router: Router, private authFacade: AuthFacade) {
    this.isAuthenticated = this.authFacade.getCurrentUser();
  }

  search(searchQuery: string): void {
    // Create the navigation extras object with the search query as a parameter
    const navigationextras: NavigationExtras = {
      queryParams: { search: searchQuery },
    };

    this.router.navigate(['/search-results'], navigationextras);
  }
  toggleCategory(): void {
    this.isCategoryOpened = !this.isCategoryOpened;
  }

  public signIn(): void {
    this.router.navigate(['sign-in']);
  }
  public signOut(): void {
    this.router.navigate(['sign-out']);
  }

  public redirect(page: string): void {
    this.router.navigate([`/${page}`]);
  }
}
