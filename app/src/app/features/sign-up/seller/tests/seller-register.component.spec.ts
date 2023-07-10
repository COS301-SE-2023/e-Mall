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
describe('RegisterComponent', () => {
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
});
