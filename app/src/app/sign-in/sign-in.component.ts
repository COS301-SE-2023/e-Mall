import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ISellerForm } from '@app/models/seller.interface';

import { CognitoService } from '@app/services/cognito.service';
import { PublicService } from '@app/services/public.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  loading: boolean;
  user: any;
  // user: ISellerForm;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private pService: PublicService
  ) {
    this.loading = false;
    this.user = { showPassword: false };
    // this.user = {} as ISellerForm;
  }

  public signIn(): void {
    // console.log(this.user.email);
    // this.pService.sellserSignIn(this.user.email).subscribe(data => {
    //   console.log(data);
    // });
    /* this.loading = true;
    this.cognitoService
      .signIn(this.user)
      .then(() => {*/
    this.router.navigate(['/construction']);
    /*  })
      .catch(() => {
        this.loading = false;
      });*/
  }
}
