import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IUser, CognitoService } from '@app/services/cognito.service'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})


export class SignInComponent implements OnInit{
  loading: boolean;
  user: IUser;
  signInForm!: FormGroup;
  formSubmitted = false;

  constructor(private router: Router, private cognitoService: CognitoService,  private formBuilder: FormBuilder) {
    this.loading = false;
    this.user = {} as IUser;
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


