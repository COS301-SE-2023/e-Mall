/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth/auth.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  isCategoryOpened = false;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      console.log('Home [Auth]: ', isAuthenticated);
    });
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
