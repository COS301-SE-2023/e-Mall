//navbar unit tests
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
import { IonicModule } from '@ionic/angular';
import { AuthState } from '@shared/features/auth/states/auth.state';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthModule } from '@shared/features/auth/auth.module';
import { AuthFacade } from '@shared/features/auth/services/auth.facade';
import { AuthService } from '@shared/features/auth/services/auth.service';
import { fakeAsync, tick } from '@angular/core/testing';
describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  // let store: Store;
  // let authFacade: AuthFacade;
  // let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot(),
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
      ],
      declarations: [NavbarComponent],
      providers: [],
    }).compileComponents();
  });
  // store = TestBed.inject(Store);
  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    // authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return null when user is not authenticated', done => {
    component.isAuthenticated.subscribe(val => {
      expect(val).toBeNull();
      done();
    });
  });

  it('should toggle the category status', () => {
    expect(component.isCategoryOpened).toBeFalse();

    component.toggleCategory();
    expect(component.isCategoryOpened).toBeTrue();

    component.toggleCategory();
    expect(component.isCategoryOpened).toBeFalse();
  });

  it('should navigate to search results page with search query', () => {
    const routerspy = spyOn(component['router'], 'navigate');

    component.search('test query');

    expect(routerspy).toHaveBeenCalledWith(['/search-results'], {
      queryParams: { search: 'test query' },
    });
  });

  it('should navigate to sign-in page', () => {
    const routerspy = spyOn(component['router'], 'navigate');

    component.signIn();

    expect(routerspy).toHaveBeenCalledWith(['sign-in']);
  });

  it('should navigate to sign-out page', () => {
    const routerspy = spyOn(component['router'], 'navigate');

    component.signOut();

    expect(routerspy).toHaveBeenCalledWith(['sign-out']);
  });

  it('should navigate to a specified page', () => {
    const routerspy = spyOn(component['router'], 'navigate');
    const page = 'home';

    component.redirect(page);

    expect(routerspy).toHaveBeenCalledWith([`/${page}`]);
  });
});
