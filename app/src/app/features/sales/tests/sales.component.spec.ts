import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';
import { SalesComponent } from '@app/features/sales/sales.component';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { of } from 'rxjs';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let analyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async () => {
    const analyticsServiceSpy = jasmine.createSpyObj('AnalyticsService', [
      'getAnalyticsData',
      'getAllProducts',
      'getConversionRate',
      'getCategoryPercentage'
    ]);

    await TestBed.configureTestingModule({
      declarations: [SalesComponent, SellerNavComponent],
      imports: [IonicModule.forRoot(), HttpClientTestingModule], // Add HttpClientTestingModule
      providers: [
        { provide: AnalyticsService, useValue: analyticsServiceSpy }
      ]
    }).compileComponents();

    analyticsService = TestBed.inject(AnalyticsService) as jasmine.SpyObj<AnalyticsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
  });

  it('should set sellerName and retrieve analytics data on component initialization', () => {
    const mockAnalyticsData = { product_clicks: 10, link_clicks: 20 };
    analyticsService.getAnalyticsData.and.returnValue(of(mockAnalyticsData));

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

  it('should render the correct values in the subcards', () => {
    const subCards = fixture.nativeElement.querySelectorAll('ion-card');
    const productsClickedCard = subCards[0];
    const websiteClicksCard = subCards[1];
    const favouritedCard = subCards[2];
    const productsClickedValue = productsClickedCard.querySelector('h1').textContent;
    const websiteClicksValue = websiteClicksCard.querySelector('h1').textContent;
    const favouritedValue = favouritedCard.querySelector('h1').textContent;
    expect(productsClickedValue).toBe(component.productsClicked.toString());
    expect(websiteClicksValue).toBe(component.websiteClicks.toString());
    expect(favouritedValue).toBe(component.favourited.toString());
  });

  it('should render two charts', () => {
    const productClicksChart = fixture.nativeElement.querySelector('#product-clicks-chart');
    const productPerformanceChart = fixture.nativeElement.querySelector('#product-performance-chart');
    const categoryPercentageChart = fixture.nativeElement.querySelector('#categoryPercentage-chart');
    expect(productClicksChart).toBeTruthy();
    expect(productPerformanceChart).toBeTruthy();
    expect(categoryPercentageChart).toBeTruthy();
  });
});
