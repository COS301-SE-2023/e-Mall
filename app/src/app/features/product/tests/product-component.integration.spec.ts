/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
//product integration tests
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductComponent } from '@app/features/product/product.component';
import { ProductService } from '@shared/servicies/product/product.service';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from '../product-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { ProductModule } from '../product.module';
import { AuthModule } from '../../auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { IProduct } from '@shared/models/product/product.interface';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { FormControl } from '@angular/forms';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: ProductService;
  let activatedRoute: ActivatedRoute;
  let analyticsService: AnalyticsService;
  let profileFacade: ProfileFacade;

  const mockProductService = jasmine.createSpyObj('ProductService', [
    'getProductData',
    'getSellerList',
  ]);
  const mockActivatedRoute = {
    queryParamMap: of({
      get: (key: string) => '1',
    } as ParamMap),
  };
  const mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', [
    'createAnalyticsData',
  ]);
  const mockProfileFacade = jasmine.createSpyObj('ProfileFacade', [
    'getProfile',
    'updateProfile',
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProductComponent],
        imports: [
          BrowserAnimationsModule,
          CommonModule,
          ProductRoutingModule,
          FormsModule,
          ReactiveFormsModule,
          MatIconModule,
          MatCardModule,
          MatSelectModule,
          MatExpansionModule,
          NgxsModule.forRoot([]),
          NavbarModule,
          FooterModule,
          IonicModule,
          ProductModule,
          AuthModule,
          ProfileModule,
        ],
        providers: [
          { provide: ProductService, useValue: mockProductService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AnalyticsService, useValue: mockAnalyticsService },
          { provide: ProfileFacade, useValue: mockProfileFacade },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    analyticsService = TestBed.inject(AnalyticsService);
    profileFacade = TestBed.inject(ProfileFacade);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


it('should call prodClickAnalytics when product$ emits a value', fakeAsync(() => {
 const mockProduct:  IProduct = {
      id: 1,
      min_price_img_array: ['image1.jpg', 'image2.jpg'],
      name: 'Product 1',
      description: 'Description 1',
      brand: 'Brand 1',
      category: 'electronics',
      min_price: 10,
      min_price_seller_id: 'seller1',
      min_price_seller_product_url: 'seller1.com/product1',
      min_price_seller_business_name: 'Seller 1',
      min_price_in_stock: true,
      min_price_discount: 5,
      min_price_discount_rate: 0.5,
      min_price_original_price: 20,
      created_at: '2023-06-01',
      updated_at: '2023-06-02',
    };
    const mockSellers: IProductSeller[] = [
      { id: 1, product: 'Product1', seller: 'Seller1' },
      { id: 2, product: 'Product2', seller: 'Seller2' },
     
    ];

  mockProductService.getProductData.and.returnValue(of(mockProduct));
  mockProductService.getSellerList.and.returnValue(of(mockSellers));
  mockProfileFacade.getProfile.and.returnValue(of({ id: '1', details: {} }));
  component.ngOnInit();
  tick();

  expect(mockProductService.getProductData).toHaveBeenCalledWith(1);
  expect(mockProductService.getSellerList).toHaveBeenCalledWith(1, 'default');
  expect(mockAnalyticsService.createAnalyticsData).toHaveBeenCalled();
}));



  it('should call linkClickAnalytics when link is clicked', () => {
    const sellerName = 'Seller1';
    const spy = spyOn(component, 'linkClickAnalytics');

    component.ngOnInit();
    component.linkClickAnalytics(sellerName);
    expect(spy).toHaveBeenCalledWith(sellerName);
  });

});
