/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRegisterComponent } from '@app/features/sign-up/seller/seller-register.component';

import { AuthService } from '@shared/features/auth/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthFacade } from '@shared/features/auth/services/auth.facade';
import { AuthModule } from '@shared/features/auth/auth.module';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthState } from '@shared/features/auth/states/auth.state';
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
        ReactiveFormsModule,
        IonicModule,
        AuthModule,
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
