import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { LoadingController, ToastController } from '@ionic/angular';
import { IError } from '@features/error/models/error.interface';
import { Observable, Subscription, take, takeUntil } from 'rxjs';
import { ToastComponent } from '@shared/components/toast/toast.component';
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
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private consumerFacade: ConsumerFacade,
    private loadingController: LoadingController,
    private toast: ToastComponent
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

  onSubmit() {
    // Handle form submission
    this.signUp();
    if (this.registerForm.valid) {
      console.log('Form submitted');
    } else {
      console.log('Form is invalid!');
      this.formSubmitted = true;
    }
  }

  async signUp() {
    const loading = await this.loadingController.create({
      message: 'Please Wait',
      duration: 2000,
      translucent: true,
    });
    await loading.present();
    // const form: IConsumerForm = this.registerForm.value;
    const form: IConsumerForm = {
      email: 'test2@test.com',
      password: '!Q2w3e4r!',
      type: '',
    };
    console.log(form);
    await this.consumerFacade.signUp(form);
    loading.dismiss();
    this.toast.presentErrorToast(this.consumerFacade.getError());
  }
  focus(val: boolean): void {
    this.passwordFocused = val;
  }
  getFormControl(field: string) {
    return this.registerForm.get(field);
  }
}
