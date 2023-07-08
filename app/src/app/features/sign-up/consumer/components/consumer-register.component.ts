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
@Component({
  selector: 'app-consumer-register',
  templateUrl: './consumer-register.component.html',
  styleUrls: ['./consumer-register.component.scss'],
})
export class ConsumerRegisterComponent {
  registerForm: FormGroup;
  passwordErrors = passwordValidationErrors;
  constructor(
    private formBuilder: FormBuilder,
    private consumerFacade: ConsumerFacade,
    private loadingController: LoadingController,
    private toast: ToastComponent
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
  }

  onSubmit() {
    if (this.registerForm.valid) this.signUp();
  }

  async signUp() {
    const loading = await this.loadingController.create({
      message: 'Please Wait',
      duration: 2000,
      translucent: true,
    });
    await loading.present();
    const form: IConsumerForm = this.registerForm.value;
    await this.consumerFacade.signUp(form);
    loading.dismiss();
    this.toast.presentErrorToast(this.consumerFacade.getError());
  }
  getFormControl(field: string) {
    return this.registerForm.get(field);
  }
}
