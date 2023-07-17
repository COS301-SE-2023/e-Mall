import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';
import { SalesComponent } from '@app/features/sales/sales.component';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesComponent, SellerNavComponent],
      imports: [IonicModule.forRoot(), HttpClientTestingModule], // Add HttpClientTestingModule
    }).compileComponents();

    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    expect(productClicksChart).toBeTruthy();
    expect(productPerformanceChart).toBeTruthy();
  });
});
