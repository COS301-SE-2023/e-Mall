/* eslint-disable @typescript-eslint/naming-convention */
//navbar integration tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
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
import { NavigationExtras, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthModule } from '@app/features/auth/auth.module';
import { AuthState } from '@app/features/auth/states/auth.state';
import { NgxsModule } from '@ngxs/store';
import { ProfileModule } from '@features/profile/profile.module';
import { DropdownPopoverComponent } from '@shared/components/dropdown-popover/dropdown-popover.component';
import { PopoverController } from '@ionic/angular';
import { NotificationModule } from '@app/features/notification/notification.module';

describe('NavbarComponentIntegration', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  let popoverController: PopoverController;

  beforeEach(async () => {
    const popoverControllerMock = {
      create: () =>
        Promise.resolve({
          present: () => Promise.resolve(),
        }),
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
        NotificationModule,
      ],
      declarations: [NavbarComponent],
      providers: [
        { provide: PopoverController, useValue: popoverControllerMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    popoverController = TestBed.inject(PopoverController);
    fixture.detectChanges();
  });

  it('should navigate to search results page with search query', () => {
    const searchQuery = 'test query';
    const navigationExtras: NavigationExtras = {
      queryParams: { search: searchQuery },
    };
    const routerNavigateSpy = spyOn(router, 'navigate');

    component.search(searchQuery);

    expect(routerNavigateSpy).toHaveBeenCalledWith(
      ['/search-results'],
      navigationExtras
    );
  });
  it('should toggle category popover', async () => {
    spyOn(popoverController, 'create').and.callThrough();
    const event = {} as Event;
    await component.toggleCategory(event);
    expect(popoverController.create).toHaveBeenCalledWith({
      component: DropdownPopoverComponent,
      event: event,
      translucent: true,
      animated: true,
      componentProps: {
        parameterData: 'Cat',
      },
    });
  });

  it('should navigate to sign-in page', () => {
    const routerNavigateSpy = spyOn(router, 'navigate');

    component.signIn();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['sign-in']);
  });

  // it('should navigate to sign-out page', () => {
  //   const routerNavigateSpy = spyOn(router, 'navigate');

  //   component.signOut();

  //   expect(routerNavigateSpy).toHaveBeenCalledWith(['sign-out']);
  // });

  it('should navigate to a specified page', () => {
    const page = 'home';
    const routerNavigateSpy = spyOn(router, 'navigate');

    component.redirect(page);

    expect(routerNavigateSpy).toHaveBeenCalledWith([`/${page}`]);
  });
});
