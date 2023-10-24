import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastComponent } from '@app/shared/components/toast/toast.component';
import {
  passwordMatchValidator,
  passwordValidationErrors,
  passwordValidator,
} from '@app/shared/validators/password/passwordValidator';
import { LoadingController } from '@ionic/angular';
import { AuthFacade } from '../auth/services/auth.facade';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
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
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  nextCode = false;
  nextNewPassword = false;
  passwordErrors = passwordValidationErrors;
  email = '';
  constructor(
    private formBuilder: FormBuilder,
    // public consumerFacade: ConsumerFacade,
    private loadingController: LoadingController,
    private toast: ToastComponent,
    private authFacade: AuthFacade
  ) {
    this.forgotForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [passwordValidator]],
        cpassword: ['', [passwordValidator]],
        code: ['', [Validators.required]],
      },
      {
        validators: passwordMatchValidator('password', 'cpassword'),
      }
    );
  }

  async onSubmit() {
    if (this.forgotForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Please Wait',
        spinner: 'dots',
        mode: 'ios',
        duration: 2000,
        translucent: true,
      });
      await loading.present();

      await this.confirmForgotPassword();
      loading.dismiss();
    }
  }
  getFormControl(field: string) {
    return this.forgotForm.get(field);
  }
  async requestForgotPasswordCode() {
    const emailCtrl = this.getFormControl('email');
    if (emailCtrl?.valid) {
      await this.authFacade.requestForgotPassword(emailCtrl.value).then(() => {
        this.nextCode = true;
        emailCtrl.disable();
      });
    }
  }

  async confirmForgotPassword() {
    if (this.forgotForm.valid) {
      const { password, code } = this.forgotForm.value;
      const email = this.forgotForm.getRawValue().email;
      await this.authFacade.confirmForgotPassword(email, code, password);
    }
  }
  // private getFormValue(form: FormGroup, field: string) {
  //   return form.controls[field].value;
  // }
  // public resend() {
  //   this.authFacade.resend(this.getFormValue(this.forgotForm, 'email'));
  // }
}
