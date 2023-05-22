import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { IUser, CognitoService } from '@app/services/cognito.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  loading: boolean;
  isConfirm: boolean;
  user: IUser;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.loading = false;
    this.isConfirm = false;
    this.user = {} as IUser;
  }

  public signUp(): void {
    this.loading = true;
    this.cognitoService
      .signUp(this.user)
      .then(() => {
        this.loading = false;
        this.isConfirm = true;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  public confirmSignUp(): void {
    this.loading = true;
    this.cognitoService
      .confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/register2']);
      })
      .catch(() => {
        this.loading = false;
      });
  }
}

