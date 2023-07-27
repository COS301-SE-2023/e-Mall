/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ISellerForm } from '@features/sign-up/seller/models/seller.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthFacade } from '@app/features/auth/services/auth.facade';
import {
  passwordMatchValidator,
  passwordValidationErrors,
  passwordValidator,
} from '@shared/validators/password/passwordValidator';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.scss'],
})
export class SellerRegisterComponent {
  loading: boolean;
  isConfirm: boolean;
  user: any;
  formSubmitted = false;

  registerFormFirst: FormGroup;
  registerFormSecond: FormGroup;
  registerFormThird: FormGroup;
  passwordErrors = passwordValidationErrors;
  stepToggle = [true, false, false];
  focus = [false, false, false];
  // constructor(private router: Router, ) {
  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private formBuilder: FormBuilder
  ) {
    this.loading = false;
    this.isConfirm = false;
    this.user = { showPassword: false };

    this.registerFormFirst = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [passwordValidator]],
        cpassword: ['', [passwordValidator]],
      },
      {
        validators: passwordMatchValidator('password', 'cpassword'),
      }
    );
    this.registerFormSecond = this.formBuilder.group({
      website: ['', Validators.required],
      feed: [''],
      typeOfBusiness: ['', Validators.required],
    });
    this.registerFormThird = this.formBuilder.group({
      catalogSize: ['', Validators.required],
      sizeOfBusiness: ['', Validators.required],
    });
  }
  onSelectionChange(event: StepperSelectionEvent) {
    // Reset all values to false
    Object.keys(this.stepToggle).forEach((key: string) => {
      this.stepToggle[+key] = false;
    });

    // Set the value of the selected step to true
    this.stepToggle[event.selectedIndex] = true;
  }

  onSubmit() {
    // Handle form submission
    if (
      this.registerFormFirst.valid &&
      this.registerFormSecond.valid &&
      this.registerFormThird.valid
    )
      this.signUp();
  }

  private getFormValue(form: FormGroup, field: string) {
    return form.controls[field].value;
  }
  getFormControl(form: FormGroup, field: string) {
    return form.get(field);
  }
  public signUp(): void {
    //      this.loading = true;
    const data: ISellerForm = {
      // username: this.getFormValue('email').split('@')[0],
      email: this.getFormValue(this.registerFormFirst, 'email'),
      password: this.getFormValue(this.registerFormFirst, 'password'),
      type: 'seller',
      // reg_no: '123456023452',
      // business_name: 'Test2 Business',
      business_type: this.getFormValue(
        this.registerFormSecond,
        'typeOfBusiness'
      ),
      // status: 'PENDING',
      // is_verified: false,
      website: this.getFormValue(this.registerFormSecond, 'website'),
      feed_url: this.getFormValue(this.registerFormSecond, 'feed'),
      catalogue_size: this.getFormValue(this.registerFormThird, 'catalogSize'),
      no_employees: this.getFormValue(this.registerFormThird, 'sizeOfBusiness'),
    };
    // this.authService.sellerSignUp(data);
    this.authFacade.signUp(data);
  }
  onInputFocus(index: number): void {
    this.focus.fill(false);
    this.focus[index] = true;
  }

}
