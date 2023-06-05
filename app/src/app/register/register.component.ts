import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { ISellerForm } from '@app/models/seller.interface';
import { AuthService } from '@app/services/auth.service';

import { CognitoService } from '@app/services/cognito.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  loading: boolean;
  isConfirm: boolean;
  user: any;
  // user: ISellerForm;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private authService: AuthService
  ) {
    this.loading = false;
    this.isConfirm = false;
    this.user = { showPassword: false };

    // this.user = {} as ISellerForm;
  }

  public signUp(): void {
    /* this.loading = true;
    this.cognitoService
      .signUp(this.user)
      .then(() => {
        this.loading = false;
        this.isConfirm = true;
      })
      .catch(() => {
        this.loading = false;
      });*/
    const data: ISellerForm = {
      username: 'test6',
      email: 'test6@test.com',
      type: 'seller',
      reg_no: '123456023456',
      business_name: 'Test1 Business',
      business_type: 'Test Type',
      catalogue_size: 200,
      business_category: 'MICRO',
      status: 'PENDING',
      is_verified: false,
      website: 'https://www.bing6.com/',
      feed_url: 'https://www.bing6.com/',
      password: '!Q2w3e4r!',
    };
    // this.authService.sellerSignUp(data);
    this.authService.sellerSignUp(data).subscribe(data => {
      console.log('hiiiiiiiiiiiii');
      console.log(data);
    });
    this.router.navigate(['/pending']);
  }

  /* public confirmSignUp(): void {
    this.loading = true;
    this.cognitoService
      .confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/register2']);
      })
      .catch(() => {
        this.loading = false;
      });
  }*/
}
