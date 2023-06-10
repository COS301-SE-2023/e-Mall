import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ISellerForm } from '@app/models/seller.interface';

// import { PublicService } from '@app/services/public.service';

import { Component, OnInit } from '@angular/core';
// import { Router} from '@angular/router';

import { IUser, CognitoService } from '@app/services/cognito.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent { 
  loading: boolean;
  isConfirm: boolean;

//   user: any;
  // user: ISellerForm;

//   constructor(private router: Router, private pService: PublicService) {

  user: IUser;
  signUpForm!: FormGroup;
  formSubmitted = false;

  constructor(private router: Router, private cognitoService: CognitoService,  private formBuilder: FormBuilder) {

    this.loading = false;
    this.isConfirm = false;
    this.user = { showPassword: false };

    // this.user = {} as ISellerForm;
  }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      cpassword: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() { return this.signUpForm.controls; }

  onSubmit() {

    // Handle form submission
    if (this.signUpForm.valid) {

      console.log('Form submitted');
      this.router.navigate(['/']);
    } else {

      console.log('Form is invalid!');
      this.formSubmitted = true;
    }
  }

   //check if password and confim password match
   passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const cpassword = formGroup.get('cpassword')?.value;
  
    if (password !== cpassword) {
      formGroup.get('cpassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('cpassword')?.setErrors(null);
    }
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
