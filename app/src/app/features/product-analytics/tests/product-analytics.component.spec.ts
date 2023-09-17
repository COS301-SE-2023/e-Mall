/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { FooterModule } from '@shared/components/footer/footer.module';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { ProductCardModule } from '@shared/components/product-card/product-card.module';
import { ProductAnalyticsComponent } from '../product-analytics.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NotificationModule } from '@app/features/notification/notification.module';

// Mock AnalyticsService
const mockAnalyticsService = {
  getAllProducts: jasmine.createSpy('getAllProducts').and.returnValue(of([])),
};

// Mock ProfileFacade
const mockProfileFacade = {
  getProfile: jasmine.createSpy('getProfile').and.returnValue(
    of({
      details: { business_name: 'Test Seller' },
    })
  ),
};

describe('ProductAnalyticsComponent', () => {
  let component: ProductAnalyticsComponent;
  let fixture: ComponentFixture<ProductAnalyticsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductAnalyticsComponent, SellerNavComponent],
      imports: [
        NgxsModule.forRoot([]),
        AuthModule,
        ProfileModule,
        HttpClientTestingModule,
        NgxsDispatchPluginModule,
        IonicModule,
        NavbarModule,
        FooterModule,
        ProductCardModule,
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDividerModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatCardModule,
        MatIconModule,
        MatPaginatorModule,
        MatSliderModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatRadioModule,
        AuthModule,
        ProfileModule,
        NotificationModule,
      ],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: ProfileFacade, useValue: mockProfileFacade },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAnalyticsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return pink color when objCount is 0', () => {
    component.objCount = 0;
    const color = component.getLineColor();
    expect(color).toBe('#FFC0CB');
  });

  it('should return blue color when objCount is 1', () => {
    component.objCount = 1;
    const color = component.getLineColor();
    expect(color).toBe('#0000FF');
  });

  it('should return green color when objCount is 2', () => {
    component.objCount = 2;
    const color = component.getLineColor();
    expect(color).toBe('#008000');
  });

  it('should return red color when objCount is 3', () => {
    component.objCount = 3;
    const color = component.getLineColor();
    expect(color).toBe('#FF0000');
  });

  it('should return orange color when objCount is 4', () => {
    component.objCount = 4;
    const color = component.getLineColor();
    expect(color).toBe('#FFA500');
  });

  it('should return black color when objCount is greater than 4', () => {
    component.objCount = 5;
    const color = component.getLineColor();
    expect(color).toBe('#000000');
  });
  /*
  it('should initialize productData when calling getSelectedProductData', () => {
    mockAnalyticsService.getSelectedProductData.and.returnValue(of({
      'product1': { 'Jan': 10, 'Feb': 15 },
      'product2': { 'Jan': 5, 'Feb': 8 },
    }));

    component.getSelectedProductData('product1');

    expect(component.productData).toEqual({
      'product1': { 'Jan': 10, 'Feb': 15 },
    });
  });
*/
  /* it('should create productClicksChart when calling createProductClicksChart', () => {
    spyOn(Chart, 'register'); // Spy on the Chart.register method
    spyOn(window, 'Chart' as any as Chart); // Spy on the Chart constructor
    component.productData = {
      'product1': { 'Jan': 10, 'Feb': 15 },
      'product2': { 'Jan': 5, 'Feb': 8 },
    };

    component.createProductClicksChart();

    expect(Chart.register).toHaveBeenCalled();
    expect(window.Chart).toHaveBeenCalled();
  });

  it('should update productClicksChart when calling createProductClicksChart again', () => {
    spyOn(Chart, 'register'); // Spy on the Chart.register method
    spyOn(window, 'Chart' as any as Chart); // Spy on the Chart constructor
    component.productClicksChart = {} as any; // Set an initial value for productClicksChart
    component.productData = {
      'product1': { 'Jan': 10, 'Feb': 15 },
      'product2': { 'Jan': 5, 'Feb': 8 },
    };

    component.createProductClicksChart();

    expect(Chart.register).toHaveBeenCalled();
    expect(window.Chart).toHaveBeenCalled();
    expect(component.productClicksChart).not.toBeUndefined();
  });*/
});
