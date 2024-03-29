import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignInFacade } from '../services/sign-in.facade';
import {
  passwordValidationErrors,
  passwordValidator,
} from '@shared/validators/password/passwordValidator';
import { ToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signInForm: FormGroup;
  passwordErrors = passwordValidationErrors;
  constructor(
    private formBuilder: FormBuilder,
    private signInFacade: SignInFacade,
    private toast: ToastComponent
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [passwordValidator]],
    });
  }

  onSubmit() {
    if (this.signInForm.valid) this.signIn();
  }

  async signIn() {
    const { email, password } = this.signInForm.value;
    await this.signInFacade.signIn(email, password);
    this.toast.presentErrorToast(this.signInFacade.getError());
  }
  getFormControl(field: string) {
    return this.signInForm.get(field);
  }
}
