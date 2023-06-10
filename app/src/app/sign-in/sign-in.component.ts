import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ISellerForm } from '@app/models/seller.interface';

import { PublicService } from '@service/public.service';
import { AuthService } from '@service/auth.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  loading: boolean;
  user: any;
  email: string | undefined;
  password: string | undefined;
  // user: ISellerForm;

  constructor(
    private router: Router,
    private AuthService: AuthService,
    private pService: PublicService
  ) {
    this.loading = false;
    this.user = { showPassword: false };
    this.email = undefined;
    this.password = undefined;
    // this.user = {} as ISellerForm;
  }

  public signIn(): void {
    // this.email = 'test2@test.com';
    // this.password = '!Q2w3e4r!';
    if (this.email && this.password) {
      this.AuthService.signIn(this.email, this.password).subscribe(() => {
        this.router.navigate(['/home']);
      });

      /* this.loading = true;
      this.cognitoService
        .signIn(this.user)
        .then(() => {*/
    }
    /*  })
      .catch(() => {
        this.loading = false;
      });*/
  }
}
