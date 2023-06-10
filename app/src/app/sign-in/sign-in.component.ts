import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISellerForm } from '@app/models/seller.interface';


import { PublicService } from '@service/public.service';
import { AuthService } from '@service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})


export class SignInComponent implements OnInit{
  loading: boolean;
  signInForm!: FormGroup;
  formSubmitted = false;

  constructor(private router: Router, private AuthService: AuthService,  private formBuilder: FormBuilder) {

    this.loading = false;
//     this.user = { showPassword: false };
//     this.email = undefined;
//     this.password = undefined;
    // this.user = {} as ISellerForm;
  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() { return this.signInForm.controls; }

  onSubmit() {

    // Handle form submission
    if (this.signInForm.valid) {
      console.log('Form submitted');
      this.router.navigate(['/']);
    } else {
      console.log('Form is invalid!');
      this.formSubmitted = true;
    }
  }

  /*
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
//     }
    /*  })

     this.loading = true;
    this.cognitoService
      .signIn(this.user)
      .then(() => {
    this.router.navigate(['/construction']);
      })

      .catch(() => {
        this.loading = false;
      });
  }*/
} 


