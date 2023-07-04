import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthFacade } from '@shared/features/auth/services/auth.facade';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  loading: boolean;
  signInForm!: FormGroup;
  formSubmitted = false;
  private subs: Subscription = new Subscription();
  constructor(
    private router: Router,
    private authFacade: AuthFacade,
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
  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
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
    this.authFacade.signIn(
      this.getFormValue('email'),
      this.getFormValue('password')
    );
    // this.subs = this.AuthService.signIn(
    //   this.getFormValue('email'),
    //   this.getFormValue('password')
    // ).subscribe(() => {
    //   this.router.navigate(['/home']);
    // });
  }
}
