/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthService } from '@app/services/auth/auth.service';
import { Router } from '@angular/router';
import { SignInComponent } from './sign-in.component';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authService: AuthService;
  let router: Router;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,],
      declarations: [SignInComponent],
      providers: [AuthService],
    }).compileComponents();

    router = TestBed.inject(Router);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should initialize the signInForm with empty values', () => {
    expect(component.signInForm.value).toEqual({
      email: '',
      password: '',
    });
  });

  it('should set formSubmitted to true on form submission when form is invalid', () => {
    component.onSubmit();
    expect(component.formSubmitted).toBeTruthy();
  });
/*
  it('should call signIn method and navigate to home on form submission when form is valid', fakeAsync(() => {
    component.signInForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });
    component.onSubmit();
    expect(authService.signIn).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('should display error messages for invalid email and password', () => {
    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '#email'
    );
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '#password'
    );
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );

    emailInput.value = 'invalid-email';
    passwordInput.value = 'short';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    submitButton.click();

    const emailErrorMessage = fixture.nativeElement.querySelector(
      '#email + .text-danger'
    );
    const passwordErrorMessage = fixture.nativeElement.querySelector(
      '#password + .text-danger'
    );

    expect(emailErrorMessage.textContent).toContain('Invalid email address');
    expect(passwordErrorMessage.textContent).toContain(
      'Password must be at least 8 characters long'
    );
  });*/
  
});
