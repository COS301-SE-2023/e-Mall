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

  // it('should set productClicksData$ and table data correctly', () => {
  //   const testData = [
  //     { product_name: 'Product 1', clicks: 10, link_clicks: 5, favourites: 2 },
  //     { product_name: 'Product 2', clicks: 15, link_clicks: 8, favourites: 3 },
  //   ];
  //   mockAnalyticsService.getAllProducts.and.returnValue(of(testData));
  //   fixture.detectChanges();

  //   expect(component.productClicksData$).toBeTruthy();
  //   expect(component.table_labels).toEqual(['Product 1', 'Product 2']);
  //   expect(component.table_product_clicks).toEqual([10, 15]);
  //   expect(component.table_link_clicks).toEqual([5, 8]);
  //   expect(component.table_favourites).toEqual([2, 3]);
  // });

  // it('should call getSelectedProductData for each product', () => {
  //   const testData = [
  //     { product_name: 'Product 1', clicks: 10, link_clicks: 5, favourites: 2 },
  //     { product_name: 'Product 2', clicks: 15, link_clicks: 8, favourites: 3 },
  //   ];
  //   mockAnalyticsService.getAllProducts.and.returnValue(of(testData));
  //   spyOn(component, 'getSelectedProductData');

  //   fixture.detectChanges();

  //   expect(component.getSelectedProductData).toHaveBeenCalledTimes(2);
  //   expect(component.getSelectedProductData).toHaveBeenCalledWith('Product 1');
  //   expect(component.getSelectedProductData).toHaveBeenCalledWith('Product 2');
  // });
});
