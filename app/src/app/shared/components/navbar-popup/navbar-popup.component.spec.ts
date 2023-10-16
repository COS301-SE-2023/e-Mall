/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
//navbar integration tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { NavbarPopupComponent } from '@shared/components/navbar-popup/navbar-popup.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SearchBarModule } from '@shared/components/search-bar/search-bar.module';
import { ViewSizeModule } from '@shared/directives/view-size/view-size.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { AuthModule } from '@app/features/auth/auth.module';
import { AuthState } from '@app/features/auth/states/auth.state';
import { NgxsModule } from '@ngxs/store';
import { ProfileModule } from '@features/profile/profile.module';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { of } from 'rxjs';
import { ISellerProfile } from '@features/profile/models/seller-profile.interface';
import { IConsumerProfile } from '@features/profile/models/consumer-profile.interface';

describe('NavbarPopUpComponentIntegration', () => {
  let component: NavbarPopupComponent;
  let fixture: ComponentFixture<NavbarPopupComponent>;
  let router: Router;
  let popoverController: PopoverController;

  beforeEach(async () => {
    const popoverControllerMock = {
      create: () =>
        Promise.resolve({
          present: () => Promise.resolve(),
        }),
    };

    const profileFacadeMock = {
      getProfile: () => of<ISellerProfile | IConsumerProfile | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([AuthState]),
        HttpClientModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ViewSizeModule,
        SearchBarModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        IonicModule,
        AuthModule,
        ProfileModule,
      ],
      declarations: [NavbarPopupComponent],
      providers: [
        { provide: PopoverController, useValue: popoverControllerMock },
        { provide: ProfileFacade, useValue: profileFacadeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarPopupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    popoverController = TestBed.inject(PopoverController);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
