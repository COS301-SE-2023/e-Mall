import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ISellerForm } from '@app/models/seller.interface';

import { PublicService } from '@app/services/public.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  loading: boolean;
  isConfirm: boolean;
  user: any;
  // user: ISellerForm;

  constructor(private router: Router, private pService: PublicService) {
    this.loading = false;
    this.isConfirm = false;
    this.user = { showPassword: false };

    // this.user = {} as ISellerForm;
  }

  public signUp(): void {
    /*  this.loading = true;
    this.cognitoService
      .signUp(this.user)
      .then(() => {
        this.loading = false;
        this.isConfirm = true;
      })
      .catch(() => {
        this.loading = false;
      });*/

    this.router.navigate(['/home']);
  }

  /* public confirmSignUp(): void {
    this.loading = true;
    this.cognitoService
      .confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/signIn']);
      })
      .catch(() => {
        this.loading = false;
      });
  }*/
}
