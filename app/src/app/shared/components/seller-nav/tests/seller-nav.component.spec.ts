/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';
import { ProfileService } from '@features/profile/services/profile.service'; // Replace with the correct import path
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('SellerNavComponent', () => {
  let component: SellerNavComponent;
  let fixture: ComponentFixture<SellerNavComponent>;
  // let router: Router;
  let profileService: Partial<ProfileService>; // Use Partial to create a partial mock of ProfileService

  beforeEach(async () => {
    profileService = {
      getProfile: jasmine.createSpy('getProfile').and.returnValue(
        Promise.resolve({
          /* mock profile data */
        })
      ),
      // Add any other methods you want to spy on and provide mock return values
    };

    await TestBed.configureTestingModule({
      declarations: [SellerNavComponent],
      imports: [
        NgxsModule.forRoot([]),
        IonicModule,
        AuthModule,
        ProfileModule,
        HttpClientTestingModule,
        NgxsDispatchPluginModule,
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
        { provide: ProfileService, useValue: profileService }, // Provide the partial mock of ProfileService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SellerNavComponent);
    component = fixture.componentInstance;
    TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a side nav with items', () => {
    const sideNav = fixture.nativeElement.querySelector('.side-nav');
    expect(sideNav).toBeTruthy();
    const items = sideNav.querySelectorAll('ion-item');
    expect(items.length).toBe(7);
  });

  it('should render the correct labels in the items', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('ion-item');

      const productsItem = items[1];
      const salesItem = items[2];
      const analyticsItem = items[3];
      const settingsItem = items[4];
      const signOutItem = items[5];
      const salesLabel = salesItem.querySelector('ion-label').textContent;
      const productsLabel = productsItem.querySelector('ion-label').textContent;
      const analticsLabel =
        analyticsItem.querySelector('ion-label').textContent;
      const SettingsLabel = settingsItem.querySelector('ion-label').textContent;
      const signOutLabel = signOutItem.querySelector('ion-label').textContent;
      expect(salesLabel).toBe('Analytics');
      expect(productsLabel).toBe('Products');
      expect(analticsLabel).toBe('Compare');
      expect(SettingsLabel).toBe('Settings');
      expect(signOutLabel).toBe('Sign out');
    });
  }));

  it('should call the navigateTo method when an item is clicked', () => {
    spyOn(component, 'navigateTo');
    const items = fixture.nativeElement.querySelectorAll('ion-item');
    const salesItem = items[1];
    salesItem.click();
    expect(component.navigateTo).toHaveBeenCalledWith('inventory');
    const productItem = items[2];
    productItem.click();
    expect(component.navigateTo).toHaveBeenCalledWith('sales');
  });
});
