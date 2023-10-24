/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRegisterComponent } from '../components/seller-register.component';

import { AuthService } from '@app/features/auth/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthFacade } from '@app/features/auth/services/auth.facade';
import { AuthModule } from '@app/features/auth/auth.module';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthState } from '@app/features/auth/states/auth.state';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViewSizeModule } from '@shared/directives/view-size/view-size.module';
import { ToastModule } from '@shared/components/toast/toast.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
/*describe('RegisterComponent', () => {
  let component: SellerRegisterComponent;
  let fixture: ComponentFixture<SellerRegisterComponent>;
  let authFacade: AuthFacade;
  let authService: AuthService;
  let router: Router;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([AuthState]),
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        IonicModule,
        AuthModule,
        MatStepperModule,
        MatButtonModule,
        MatIconModule,
        ViewSizeModule,
        ToastModule,
      ],
      declarations: [SellerRegisterComponent],
      providers: [AuthFacade],
    }).compileComponents();
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SellerRegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/
describe('SellerRegisterComponent', () => {
  let component: SellerRegisterComponent;
  let fixture: ComponentFixture<SellerRegisterComponent>;
  let authFacade: AuthFacade;
  let authService: AuthService;
  let router: Router;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([AuthState]),
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        IonicModule,
        AuthModule,
        MatStepperModule,
        MatButtonModule,
        MatIconModule,
        ViewSizeModule,
        ToastModule,
      ],
      declarations: [SellerRegisterComponent],
      providers: [AuthFacade],
    }).compileComponents();
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerRegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    authFacade = TestBed.inject(AuthFacade);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set stepToggle on selection change', () => {
    const event = { selectedIndex: 1 } as StepperSelectionEvent;
    component.onSelectionChange(event);
    expect(component.stepToggle).toEqual([false, true, false]);
  });

  it('should call signUp method when form is valid', () => {
    spyOn(component, 'cognitoSignUp').and.returnValue(Promise.resolve());
    // spyOn(component, 'cognitoSignUp');
    component.registerFormFirst.controls['email'].setValue('test@example.com');
    component.registerFormFirst.controls['password'].setValue('Test1234!');
    component.registerFormFirst.controls['cpassword'].setValue('Test1234!');
    component.registerFormSecond.controls['website'].setValue(
      'www.example.com'
    );
    component.registerFormSecond.controls['typeOfBusiness'].setValue('Type');
    component.registerFormThird.controls['catalogSize'].setValue('Size');
    component.registerFormThird.controls['sizeOfBusiness'].setValue(
      'BusinessSize'
    );
    component.confirmForm.controls['code'].setValue('123456');
    component.onSubmit();

    expect(component.cognitoSignUp).toHaveBeenCalled();
  });

  it('should not call signUp method when form is invalid', () => {
    spyOn(component, 'cognitoSignUp').and.returnValue(Promise.resolve());
    // spyOn(component, 'signUp');
    component.registerFormFirst.controls['email'].setValue('test@example.com');
    component.registerFormFirst.controls['password'].setValue('Test1234!');
    component.registerFormFirst.controls['cpassword'].setValue(
      'DifferentPassword'
    );
    component.registerFormSecond.controls['website'].setValue(
      'www.example.com'
    );
    component.registerFormSecond.controls['typeOfBusiness'].setValue('Type');
    component.registerFormThird.controls['catalogSize'].setValue('Size');
    component.registerFormThird.controls['sizeOfBusiness'].setValue(
      'BusinessSize'
    );
    // spyOn(component, 'cognitoSignUp').and.returnValue(Promise.resolve());
    component.onSubmit();

    expect(component.cognitoSignUp).not.toHaveBeenCalled();
  });

  it('should call authFacade.signUp method when signUp is called', () => {
    spyOn(authFacade, 'signUp');
    component.registerFormFirst.controls['email'].setValue('test@example.com');
    component.registerFormFirst.controls['password'].setValue('Test1234!');
    component.registerFormFirst.controls['cpassword'].setValue('Test1234!');
    component.registerFormSecond.controls['website'].setValue(
      'www.example.com'
    );
    component.registerFormSecond.controls['typeOfBusiness'].setValue('Type');
    component.registerFormThird.controls['catalogSize'].setValue('Size');
    component.registerFormThird.controls['sizeOfBusiness'].setValue(
      'BusinessSize'
    );

    component.signUp();

    expect(authFacade.signUp).toHaveBeenCalled();
  });
});
