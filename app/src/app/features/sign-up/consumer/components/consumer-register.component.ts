import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsumerFacade } from '../services/consumer.facade';
import {
  passwordMatchValidator,
  passwordValidationErrors,
  passwordValidator,
} from '@shared/validators/password/passwordValidator';
import { IConsumerForm } from '@features/sign-up/consumer/models/consumer.interface';
import { LoadingController } from '@ionic/angular';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { AuthFacade } from '@app/features/auth/services/auth.facade';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-consumer-register',
  templateUrl: './consumer-register.component.html',
  styleUrls: ['./consumer-register.component.scss'],
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
export class ConsumerRegisterComponent {
  registerForm: FormGroup;
  confirmForm: FormGroup;
  passwordErrors = passwordValidationErrors;
  loading = false;
  next = false;
  constructor(
    private formBuilder: FormBuilder,
    public consumerFacade: ConsumerFacade,
    private loadingController: LoadingController,
    private toast: ToastComponent,
    private authFacade: AuthFacade
  ) {
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
    this.confirmForm = this.formBuilder.group({
      code: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      await this.cognitoSignUp().then(() => {
        this.next = true;
      });
    }
  }

  async signUp() {
    const loading = await this.loadingController.create({
      message: 'Please Wait',
      spinner: 'dots',
      mode: 'ios',
      duration: 2000,
      translucent: true,
    });
    await loading.present();
    const { email, password } = this.registerForm.value;
    const form: IConsumerForm = {
      email,
      password,
      type: 'consumer',
    };
    await this.consumerFacade.signUp(form);
    loading.dismiss();
    // this.toast.presentErrorToast(this.consumerFacade.getError());
  }
  getFormControl(field: string) {
    return this.registerForm.get(field);
  }
  public async confirmSignUp(): Promise<void> {
    this.loading = true;
    await this.consumerFacade
      .confirmSignUp(
        this.getFormValue(this.registerForm, 'email'),
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
    if (this.registerForm.valid) {
      console.log(this.registerForm);
      await this.consumerFacade.congnitoSignUp(
        this.getFormValue(this.registerForm, 'email'),
        this.getFormValue(this.registerForm, 'password'),
        'consumer'
      );
    }
  }
  private getFormValue(form: FormGroup, field: string) {
    return form.controls[field].value;
  }
  public resend() {
    this.authFacade.resend(this.getFormValue(this.registerForm, 'email'));
  }
}
