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
import { NgxsModule } from '@ngxs/store';
import { AuthModule } from '@app/features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NotificationModule } from '@app/features/notification/notification.module';
describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot(),
        NgxsDispatchPluginModule.forRoot(),
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

  it('should navigate to a specified page', () => {
    const routerspy = spyOn(component['router'], 'navigate');
    const page = 'home';

    component.redirect(page);

    expect(routerspy).toHaveBeenCalledWith([`/${page}`]);
  });
});
