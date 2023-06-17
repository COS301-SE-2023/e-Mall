import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// import { CognitoService } from '@app/services/cognito.service';
import { PublicService } from './services/public.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Angular 15.2.9 and DRF (AUTH SYSTEM EXAMPLE)';
  msg: string | undefined;
  isAuthenticated: boolean;

  constructor(
    private pService: PublicService,
    private router: Router,
    private AuthService: AuthService
  ) {
    this.isAuthenticated = false;
  }
  public ngOnInit(): void {
    // this.showMessage();
    // this.AuthService.isAuthenticated().subscribe(val => {
    // console.log('Auth: ', val);
    // this.isAuthenticated = val;
    // });w
    console.log('app.component');
  }

  // showMessage() {
  //   this.pService.getMessages().subscribe(data => {
  //     this.msg = data.toString();
  //     console.log(this.msg);
  //   });
  // }
  public signOut(): void {
    this.router.navigate(['/sign-out']);
  }
}
