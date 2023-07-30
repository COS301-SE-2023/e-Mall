/* eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthModule } from '@features/auth/auth.module';
import { ProductAnalyticsComponent } from '@features/product-analytics/product-analytics.component';
import { ProfileModule } from '@features/profile/profile.module';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { IonicModule } from '@ionic/angular';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsModule } from '@ngxs/store';
import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { Chart } from 'chart.js';
import { of } from 'rxjs';


// Mock AnalyticsService
const mockAnalyticsService = {
  getAllProducts: jasmine.createSpy('getAllProducts').and.returnValue(of([])),
};

// Mock ProfileFacade
const mockProfileFacade = {
  getProfile: jasmine.createSpy('getProfile').and.returnValue(of({
    details: { business_name: 'Test Seller' },
  })),
};

describe('ProductAnalyticsComponent', () => {
  let component: ProductAnalyticsComponent;
  let fixture: ComponentFixture<ProductAnalyticsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductAnalyticsComponent, SellerNavComponent],
      imports: [
        NgxsModule.forRoot([]),
        IonicModule,
        AuthModule,
        ProfileModule,
        HttpClientTestingModule,
        NgxsDispatchPluginModule
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

 /* it('should call getAllProducts from AnalyticsService with sellerName', () => {
    expect(mockAnalyticsService.getAllProducts).toHaveBeenCalledWith('Test Seller');
  });*/

  it('should set productClicksData$ and table data correctly', () => {
    const testData = [
      { product_name: 'Product 1', clicks: 10, link_clicks: 5, favourites: 2 },
      { product_name: 'Product 2', clicks: 15, link_clicks: 8, favourites: 3 },
    ];
    mockAnalyticsService.getAllProducts.and.returnValue(of(testData));
    fixture.detectChanges();

    expect(component.productClicksData$).toBeTruthy();
    expect(component.table_labels).toEqual(['Product 1', 'Product 2']);
    expect(component.table_product_clicks).toEqual([10, 15]);
    expect(component.table_link_clicks).toEqual([5, 8]);
    expect(component.table_favourites).toEqual([2, 3]);
  });

  it('should call getSelectedProductData for each product', () => {
    const testData = [
      { product_name: 'Product 1', clicks: 10, link_clicks: 5, favourites: 2 },
      { product_name: 'Product 2', clicks: 15, link_clicks: 8, favourites: 3 },
    ];
    mockAnalyticsService.getAllProducts.and.returnValue(of(testData));
    spyOn(component, 'getSelectedProductData');

    fixture.detectChanges();

    expect(component.getSelectedProductData).toHaveBeenCalledTimes(2);
    expect(component.getSelectedProductData).toHaveBeenCalledWith('Product 1');
    expect(component.getSelectedProductData).toHaveBeenCalledWith('Product 2');
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