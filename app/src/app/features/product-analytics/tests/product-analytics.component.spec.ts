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

describe('ProductAnalyticsComponent', () => {
  let component: ProductAnalyticsComponent;
  let fixture: ComponentFixture<ProductAnalyticsComponent>;
  let mockAnalyticsService: jasmine.SpyObj<any>;
  let mockProfileFacade: jasmine.SpyObj<any>;

  beforeEach(async () => {
    mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', ['getAnalyticsData', 'getAllProducts', 'getSelectedProductData']);
    mockProfileFacade = jasmine.createSpyObj('ProfileFacade', ['getProfile']);

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

  it('should create productClicksChart when calling createProductClicksChart', () => {
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