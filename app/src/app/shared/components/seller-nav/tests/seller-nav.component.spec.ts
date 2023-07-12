// Import the component and the dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';

describe('SellerNavComponent', () => {
  let component: SellerNavComponent;
  let fixture: ComponentFixture<SellerNavComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerNavComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SellerNavComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a side nav with items', () => {
    const sideNav = fixture.nativeElement.querySelector('.side-nav');
    expect(sideNav).toBeTruthy();
    const items = sideNav.querySelectorAll('ion-item');
    expect(items.length).toBe(6);
  });

  it('should render the correct labels in the items', () => {
    const items = fixture.nativeElement.querySelectorAll('ion-item');
    const salesItem = items[1];
    const productsItem = items[2];
    const messagesItem = items[3];
    const settingsItem = items[4];
    const signOutItem = items[5];
    const salesLabel = salesItem.querySelector('ion-label').textContent;
    const productsLabel = productsItem.querySelector('ion-label').textContent;
    const messagesLabel = messagesItem.querySelector('ion-label').textContent;
    const settingsLabel = settingsItem.querySelector('ion-label').textContent;
    const signOutLabel = signOutItem.querySelector('ion-label').textContent;
    expect(salesLabel).toBe('Sales');
    expect(productsLabel).toBe('Products');
    expect(messagesLabel).toBe('Messages');
    expect(settingsLabel).toBe('Settings');
    expect(signOutLabel).toBe('Sign out');
  });

  it('should call the navigateTo method when an item is clicked', () => {
    spyOn(component, 'navigateTo');
    const items = fixture.nativeElement.querySelectorAll('ion-item');
    const salesItem = items[1];
    salesItem.click();
    expect(component.navigateTo).toHaveBeenCalledWith('sales');
  });

  it('should navigate to the correct route when an item is clicked', () => {
    const items = fixture.nativeElement.querySelectorAll('ion-item');
    const productsItem = items[2];
    productsItem.click();
    expect(router.navigate).toHaveBeenCalledWith(['/construction']);
  });
});
