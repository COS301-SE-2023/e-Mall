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
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.scss'],
  animations: [
    trigger('initFadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      // transition(':leave', [animate(500, style({ opacity: 0 }))]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(100, style({ opacity: 0 }))]),
    ]),
  ],
})
export class SellerRegisterComponent {
  loading: boolean;
  isConfirm: boolean;
  user: any;
  formSubmitted = false;

  registerFormFirst: FormGroup;
  registerFormSecond: FormGroup;
  registerFormThird: FormGroup;
  confirmForm: FormGroup;

  passwordErrors = passwordValidationErrors;
  stepToggle = [true, false, false];
  focus = [false, false, false];
  next = false;
  emailErrorMessage = 'Invalid email address';
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
    this.confirmForm = this.formBuilder.group({
      code: ['', [Validators.required]],
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

  async onSubmit() {
    // Handle form submission
    if (
      this.registerFormFirst.valid &&
      this.registerFormSecond.valid &&
      this.registerFormThird.valid
    )
      await this.cognitoSignUp().then(() => {
        this.next = true;
      });
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
  public async confirmSignUp(): Promise<void> {
    this.loading = true;
    await this.authFacade
      .confirmSignUp(
        this.getFormValue(this.registerFormFirst, 'email'),
        this.getFormValue(this.confirmForm, 'code')
      )
      .then(() => {
        if (this.authFacade.confirmed) return this.signUp();
        else {
          console.log('else');
          return;
        }
      })
      .catch(() => {
        this.loading = false;
      });
  }
  async cognitoSignUp() {
    if (this.registerFormFirst.valid) {
      await this.authFacade.congnitoSignUp(
        this.getFormValue(this.registerFormFirst, 'email'),
        this.getFormValue(this.registerFormFirst, 'password'),
        'seller'
      );
    }
  }
  async doesEmailExist() {
    const email = this.getFormControl(this.registerFormFirst, 'email');
    console.log('in here');
    if (email && email.invalid === false) {
      const res = await this.authFacade.doesEmailExist(email.value);
      if (res) {
        this.emailErrorMessage = 'Email already exists';
        email.setErrors({ invalid: true });
      }
    } else {
      console.log('not here');

      this.emailErrorMessage = 'Invalid email address';
    }
  }
}
