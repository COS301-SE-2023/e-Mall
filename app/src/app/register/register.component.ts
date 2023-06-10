import { Component, OnInit} from '@angular/core';

import { Router } from '@angular/router';
import { IUser, CognitoService } from '@app/services/cognito.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit{
  loading: boolean;
  isConfirm: boolean;
  user: IUser;
  registerForm!: FormGroup;
  formSubmitted = false;
  

  constructor(private router: Router, private cognitoService: CognitoService, private formBuilder: FormBuilder) {
    this.loading = false;
    this.isConfirm = false;
    this.user = {} as IUser;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      cpassword: ['', Validators.required],
      Website: ['', Validators.required],
      feed: [''],
      typeOfBusiness: ['', Validators.required],
      catalogSize: ['', Validators.required],
      sizeOfBusiness: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {

    // Handle form submission
    if (this.registerForm.valid) {
      console.log('Form submitted');
      //console.log(this.registerForm.value);
      this.router.navigate(['/pending']);
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

  /*
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
    this.router.navigate(['/pending']);
  }*/

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
