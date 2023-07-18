import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SalesComponent } from '@features/sales/sales.component';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';

import { IonicModule } from '@ionic/angular';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let analyticsService: AnalyticsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SalesComponent, SellerNavComponent,IonicModule,
        AuthModule,
        ProfileModule,
       ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule],
      providers: [AnalyticsService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should set sellerName and retrieve analytics data on component initialization', () => {
    const mockAnalyticsData = { product_clicks: 10, link_clicks: 20 };
    spyOn(analyticsService, 'getAnalyticsData').and.returnValue(of(mockAnalyticsData));

    fixture.detectChanges();

    expect(component.sellerName).toBe('Amazon');
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
      expect(productsClickedValue).toBe('0');
      expect(websiteClicksValue).toBe('0');
      expect(favouritedValue).toBe('0');
    });
  }));

  it('should render two charts', () => {
    const productClicksChart = fixture.nativeElement.querySelector('#product-clicks-chart');
    const productPerformanceChart = fixture.nativeElement.querySelector('#product-performance-chart');
    const categoryPercentageChart = fixture.nativeElement.querySelector('#categoryPercentage-chart');
    expect(productClicksChart).toBeTruthy();
    expect(productPerformanceChart).toBeTruthy();
    expect(categoryPercentageChart).toBeTruthy();
  });
});
