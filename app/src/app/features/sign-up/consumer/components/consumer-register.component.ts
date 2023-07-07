import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// import { PublicService } from '@app/services/public.service';
// import { Router} from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsumerFacade } from '../services/consumer.facade';
import {
  passwordMatchValidator,
  passwordValidationErrors,
  passwordValidator,
} from '@shared/validators/password/passwordValidator';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';
@Component({
  selector: 'app-consumer-register',
  templateUrl: './consumer-register.component.html',
  styleUrls: ['./consumer-register.component.scss'],
})
export class ConsumerRegisterComponent {
  loading: boolean;
  isConfirm: boolean;
  user: any;
  registerForm: FormGroup;
  formSubmitted = false;
  passwordErrors = passwordValidationErrors;
  passwordFocused = false;
  // constructor(private router: Router, ) {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private consumerFacade: ConsumerFacade
  ) {
    this.loading = false;
    this.isConfirm = false;
    this.user = { showPassword: false };
    // this.user = {} as ISellerForm;
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [passwordValidator]],
        cpassword: ['', [passwordValidator]],
      },
      {
        validators: passwordMatchValidator('password', 'cpassword'),
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    // Handle form submission
    if (this.registerForm.valid) {
      console.log('Form submitted');
      this.signUp();
    } else {
      console.log('Form is invalid!');
      this.formSubmitted = true;
    }
  }

  signUp(): void {
    const form: IConsumerForm = this.registerForm.value;
    // this.consumerFacade.signUp(form);
  }
  focus(val: boolean): void {
    this.passwordFocused = val;
  }
  getFormControl(field: string) {
    return this.registerForm.get(field);
  }
}
