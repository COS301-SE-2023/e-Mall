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

describe('NavbarComponentIntegration', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(async () => {
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
      declarations: [NavbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should toggle the category status', () => {
    expect(component.isCategoryOpened).toBeFalse();

    component.toggleCategory();
    expect(component.isCategoryOpened).toBeTrue();

    component.toggleCategory();
    expect(component.isCategoryOpened).toBeFalse();
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

  it('should navigate to sign-in page', () => {
    const routerNavigateSpy = spyOn(router, 'navigate');

    component.signIn();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['sign-in']);
  });

  it('should navigate to sign-out page', () => {
    const routerNavigateSpy = spyOn(router, 'navigate');

    component.signOut();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['sign-out']);
  });

  it('should navigate to a specified page', () => {
    const page = 'home';
    const routerNavigateSpy = spyOn(router, 'navigate');

    component.redirect(page);

    expect(routerNavigateSpy).toHaveBeenCalledWith([`/${page}`]);
  });
});
