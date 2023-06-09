//navbar unit tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
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

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule,
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
      ],
      declarations: [NavbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isAuthenticated to false', () => {
    expect(component.isAuthenticated).toBeFalse();
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
