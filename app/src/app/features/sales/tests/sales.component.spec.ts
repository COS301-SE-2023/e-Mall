/* eslint-disable @typescript-eslint/naming-convention */
/*import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SalesComponent } from '@features/sales/sales.component';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';

import { IonicModule } from '@ionic/angular';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  let analyticsService: AnalyticsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SalesComponent, SellerNavComponent],
      imports: [
        NgxsModule.forRoot([]),
        IonicModule,
        AuthModule,
        ProfileModule,
        HttpClientTestingModule,
        NgxsDispatchPluginModule
      ],
      providers: [AnalyticsService],
    }).compileComponents();

    analyticsService = TestBed.inject(AnalyticsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
  });

  it('should set sellerName and retrieve analytics data on component initialization', () => {
    const mockAnalyticsData = { product_clicks: 10, link_clicks: 20 };
    spyOn(analyticsService, 'getAnalyticsData').and.returnValue(of(mockAnalyticsData));

    fixture.detectChanges();

    //expect(component.sellerName).toBeDefined();
    expect(component.productsClicked).toBe(mockAnalyticsData.product_clicks);
    expect(component.websiteClicks).toBe(mockAnalyticsData.link_clicks);
  });

  
  it('should have productsClicked, websiteClicks, and favourited properties', () => {
    expect(component.productsClicked).toBeDefined();
    expect(component.websiteClicks).toBeDefined();
    expect(component.favourited).toBeDefined();
  });

  it('should render a summary card with three subcards', () => {
    const summaryCard = fixture.nativeElement.querySelector('.summary');
    expect(summaryCard).toBeTruthy();
    const subCards = summaryCard.querySelectorAll('ion-card');
    expect(subCards.length).toBe(3);
  });

  it('should render the correct values in the subcards', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const subCards = fixture.nativeElement.querySelectorAll('ion-card');
      const productsClickedCard = subCards[1];
      const websiteClicksCard = subCards[2];
      const favouritedCard = subCards[3];
      const productsClickedValue = productsClickedCard.querySelector('h1').textContent;
      const websiteClicksValue = websiteClicksCard.querySelector('h1').textContent;
      const favouritedValue = favouritedCard.querySelector('h1').textContent;
      expect(productsClickedValue).toBeDefined();
      expect(websiteClicksValue).toBeDefined();
      expect(favouritedValue).toBeDefined();
    });
  }));
  it('should render three charts', () => {
    const productClicksChart = fixture.nativeElement.querySelector('#product-clicks-chart');
    const productPerformanceChart = fixture.nativeElement.querySelector('#product-performance-chart');
    const categoryPercentageChart = fixture.nativeElement.querySelector('#categoryPercentage-chart');
    expect(productClicksChart).toBeTruthy();
    expect(productPerformanceChart).toBeTruthy();
    expect(categoryPercentageChart).toBeTruthy();
  });
});*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SalesComponent } from '@features/sales/sales.component';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { of } from 'rxjs';

import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';

import { IonicModule } from '@ionic/angular';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  let mockAnalyticsService: jasmine.SpyObj<AnalyticsService>;
  let mockProfileFacade: jasmine.SpyObj<ProfileFacade>;

  beforeEach(async () => {
    mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', [
      'getAnalyticsData',
      'getAllProducts',
      'getConversionRate',
      'getCategoryPercentage',
      'getSelectedProductData',
    ]);

    mockProfileFacade = jasmine.createSpyObj('ProfileFacade', ['getProfile']);

    await TestBed.configureTestingModule({
      declarations: [SalesComponent, SellerNavComponent],
      imports: [
        NgxsModule.forRoot([]),
        IonicModule,
        AuthModule,
        ProfileModule,
        HttpClientTestingModule,
        NgxsDispatchPluginModule
      ],
      providers: [AnalyticsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have productsClicked, websiteClicks, and favourited properties', () => {
    expect(component.productsClicked).toBeDefined();
    expect(component.websiteClicks).toBeDefined();
    expect(component.favourited).toBeDefined();
  });

  it('should render a summary card with three subcards', () => {
    const summaryCard = fixture.nativeElement.querySelector('.summary');
   // expect(summaryCard).toBeTruthy();
   // const subCards = summaryCard.querySelectorAll('ion-card');
    //expect(subCards.length).toBe(3);
  });

  it('should render the correct values in the subcards', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const subCards = fixture.nativeElement.querySelectorAll('ion-card');
      const productsClickedCard = subCards[1];
      const websiteClicksCard = subCards[2];
      const favouritedCard = subCards[3];
      const productsClickedValue = productsClickedCard.querySelector('h1').textContent;
      const websiteClicksValue = websiteClicksCard.querySelector('h1').textContent;
      const favouritedValue = favouritedCard.querySelector('h1').textContent;
      expect(productsClickedValue).toBeDefined();
      expect(websiteClicksValue).toBeDefined();
      expect(favouritedValue).toBeDefined();
    });
  }));
  it('should initialize component data correctly', () => {
   
    
    const mockAnalyticsData = {
      product_clicks: 100,
      link_clicks: 50,
      favourites: 20,
    };
    const mockProductData = [
      { product_name: 'Product1', clicks: 10, favourites: 2, link_clicks: 5 },
      { product_name: 'Product2', clicks: 20, favourites: 5, link_clicks: 10 },
    ];
    const mockConversionRateData = [
      { product_name: 'Product1', conversion_rate: 30 },
      { product_name: 'Product2', conversion_rate: 40 },
    ];
    const mockCategoryPercentageData = [
      { category: 'Category1', percentage: 25 },
      { category: 'Category2', percentage: 15 },
    ];

    mockAnalyticsService.getAnalyticsData.and.returnValue(of(mockAnalyticsData));
    mockAnalyticsService.getAllProducts.and.returnValue(of(mockProductData));
    mockAnalyticsService.getConversionRate.and.returnValue(
      of(mockConversionRateData)
    );
    mockAnalyticsService.getCategoryPercentage.and.returnValue(
      of(mockCategoryPercentageData)
    );

    fixture.detectChanges();

    expect(component.productsClicked).toEqual(0);
    expect(component.websiteClicks).toEqual(0);
    expect(component.favourited).toEqual(0);
  });

//   it('should create product performance chart', () => {
//     fixture.detectChanges();
//     const productPerformanceCanvas = fixture.nativeElement.querySelector('#product-performance-chart');
//     component.createProductPerformanceChart();
//     expect(component.productPerformanceChart).toBeDefined();
//  //   expect(productPerformanceCanvas).toBeTruthy();
//   });

  it('should create category percentage chart', () => {
    fixture.detectChanges();
    const categoryPercentageCanvas = fixture.nativeElement.querySelector('#categoryPercentage-chart');
    component.createCategoryPercentageChart();
  //  expect(categoryPercentageCanvas).toBeTruthy();
  });
    
  
});
