import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  // isAuthenticated$;
  constructor(private authService: AuthService, private router: Router) {
    // this.isAuthenticated$ = this.authService.isAuthenticated();
    // this.isAuthenticated$.subscribe(val => console.log('Home [Auth]: ', val));
    // this.authService.isAuthenticated().subscribe(val => {
    //   this.isAuthenticated = val;
    // });
  }
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      console.log('Home [Auth]: ', isAuthenticated);
    });
  }
  public signOut(): void {
    this.router.navigate(['sign-out']);
  }
}
