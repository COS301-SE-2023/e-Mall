import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISellerForm } from '@app/models/seller/seller.interface';
import { AuthService } from '@app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  loading: boolean;
  signInForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private router: Router,
    private AuthService: AuthService,
    private formBuilder: FormBuilder
  ) {
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

  get f() {
    return this.signInForm.controls;
  }
  private getFormValue(field: string) {
    return this.signInForm.controls[field].value;
  }
  onSubmit() {
    // Handle form submission
    if (this.signInForm.valid) {
      console.log('Form submitted');
      this.signIn();
    } else {
      console.log('Form is invalid!');
      this.formSubmitted = true;
    }
  }

  public signIn(): void {
    this.AuthService.signIn(
      this.getFormValue('email'),
      this.getFormValue('password')
    ).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}
