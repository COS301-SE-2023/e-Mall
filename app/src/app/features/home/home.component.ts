import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isAuthenticated = false;
  images = [944, 1011, 984].map(n => `https://picsum.photos/id/${n}/900/500`);
  // isAuthenticated$;
  constructor(private authService: AuthService, private router: Router) {
    // this.isAuthenticated$ = this.authService.isAuthenticated();
    // this.isAuthenticated$.subscribe(val => console.log('Home [Auth]: ', val));
    // this.authService.isAuthenticated().subscribe(val => {
    //   this.isAuthenticated = val;
    // });
  }
  search(searchQuery: string): void {
    // Create the navigation extras object with the search query as a parameter
    const navigationextras: NavigationExtras = {
      queryParams: { search: searchQuery },
    };

    this.router.navigate(['/search-results'], navigationextras);
  }
}
