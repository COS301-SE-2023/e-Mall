// /* eslint-disable @typescript-eslint/naming-convention */
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ConsumerRegisterComponent } from '../components/consumer-register.component';
// import { AuthService } from '@app/features/auth/services/auth.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpClientModule } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';

// describe('ConsumerRegisterComponent', () => {
//   let component: ConsumerRegisterComponent;
//   let fixture: ComponentFixture<ConsumerRegisterComponent>;
//   // let authService: jasmine.SpyObj<AuthService>;

//   beforeEach(async () => {
//     const authServiceSpy = jasmine.createSpyObj('AuthService', ['signUp']);

//     await TestBed.configureTestingModule({
//       imports: [
//         RouterTestingModule,
//         HttpClientModule,
//         FormsModule,
//         ReactiveFormsModule,
//         IonicModule,
//       ],
//       declarations: [ConsumerRegisterComponent],
//       providers: [{ provide: AuthService, useValue: authServiceSpy }],
//     }).compileComponents();

//     // authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ConsumerRegisterComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize the sign up form', () => {
//     expect(component.signUpForm).toBeDefined();
//     expect(component.signUpForm.get('email')).toBeDefined();
//     expect(component.signUpForm.get('password')).toBeDefined();
//     expect(component.signUpForm.get('cpassword')).toBeDefined();
//   });
//   /*
//   it('should navigate to home page on successful form submission', () => {
//     const email = 'test@example.com';
//     const password = 'password';

//     component.signUpForm.setValue({
//       email,
//       password,
//       cpassword: password,
//     });

//     spyOn(authService, 'signUp').and.returnValue(of({}));

//     const routerSpy = spyOn(component.router, 'navigate');

//     component.onSubmit();

//     expect(authService.signUp).toHaveBeenCalledWith(email, password);
//     expect(routerSpy).toHaveBeenCalledWith(['/']);
//   });*/
//   /*
//   it('should not navigate to home page on form submission with invalid form', () => {
//     spyOn(authService, 'signUp').and.returnValue(of({}));
//     const routerSpy = spyOn(component.router, 'navigate');

//     component.onSubmit();

//     expect(authService.signUp).not.toHaveBeenCalled();
//     expect(routerSpy).not.toHaveBeenCalled();
//   });

// */
//   /*
//   it('should display error messages for required fields', () => {
//     const emailControl = component.signUpForm.get('email');
//     const passwordControl = component.signUpForm.get('password');
//     const cpasswordControl = component.signUpForm.get('cpassword');

//   //   emailControl?.setValue('');
//   //   passwordControl?.setValue('');
//   //   cpasswordControl?.setValue('');

//   //   component.onSubmit();

//   //   expect(emailControl?.errors?.['required']).toBeTruthy();
//   //   expect(passwordControl?.errors?.['required']).toBeTruthy();
//   //   expect(cpasswordControl?.errors?.['required']).toBeTruthy();

//   //   const errorMessageElements =
//   //     fixture.nativeElement.querySelectorAll('.errorMsg');
//   //   expect(errorMessageElements.length).toBe(3);
//   // });

//   // it('should display error message for invalid email', () => {
//   //   const emailControl = component.signUpForm.get('email');

//   //   emailControl?.setValue('invalid-email');

//   //   component.onSubmit();

//   //   expect(emailControl?.errors?.['email']).toBeTruthy();

//   //   const errorMessageElement =
//   //     fixture.nativeElement.querySelector('.errorMsg');
//   //   expect(errorMessageElement.textContent).toContain('Invalid email address');
//   // });

//   // it('should display error message for password mismatch', () => {
//   //   const passwordControl = component.signUpForm.get('password');
//   //   const cpasswordControl = component.signUpForm.get('cpassword');

//   //   passwordControl?.setValue('password1');
//   //   cpasswordControl?.setValue('password2');

//   //   component.onSubmit();

//   //   expect(cpasswordControl?.errors?.['passwordMismatch']).toBeTruthy();

//     const errorMessageElement = fixture.nativeElement.querySelector('.errorMsg');
//     expect(errorMessageElement.textContent).toContain('Password and Confirm Password do not match');
//   });*/
// });
