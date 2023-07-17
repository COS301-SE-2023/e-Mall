//product unit tests
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IProduct } from '@shared/models/product/product.interface';
import { of } from 'rxjs';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { ProductModule } from '../product.module';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: ProductService;
  let router: Router;
  // eslint-disable-next-line prefer-const
  let mockProductService = jasmine.createSpyObj('ProductService', [
    'getProductData',
    'getSellerList',
  ]);
  const mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', [
    'createAnalyticsData',
  ]);
  const mockActivatedRoute = {
    queryParamMap: of({
      get: (key: string) => '1', // Assuming 'prod_id' query parameter is set to 1
    } as ParamMap),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
        NgxsDispatchPluginModule,
        NavbarModule,
        FooterModule,
        IonicModule,
        AuthModule,
        ProfileModule,
        ProductModule,
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create the ProductComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch productData on initialization', done => {
    const mockProduct: IProduct = {
      id: 1,
      min_price_img_array: ['image1.jpg', 'image2.jpg'],
      name: 'Product 1',
      description: 'Description 1',
      brand: 'Brand 1',
      category: 'Category 1',
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

    mockProductService.getProductData.and.returnValue(of(mockProduct));

    component.prod_id = 1;
    component.ngOnInit();

    expect(mockProductService.getProductData).toHaveBeenCalledWith(
      component.prod_id
    );
    component.product$?.subscribe(product => {
      expect(product).toEqual(mockProduct);
      done();
    });

    fixture.detectChanges();
  });

  it('should fetch SellerList on initialization', done => {
    const sellerList: IProductSeller[] = [
      { id: 1, product: 'Product1', seller: 'Seller1' },
      { id: 2, product: 'Product2', seller: 'Seller2' },
    ];
    mockProductService.getSellerList.and.returnValue(of(sellerList));

    component.prod_id = 1;
    component.ngOnInit();

    expect(mockProductService.getSellerList).toHaveBeenCalledWith(
      component.prod_id,
      'default'
    );
    component.sellers$?.subscribe(product => {
      expect(product).toEqual(sellerList);
      done();
    });
    fixture.detectChanges();
  });

  it('should display seller list', () => {
    const sellers = [
      {
        id: 1,
        business_name: 'Seller 1',
        price: 50,
        in_stock: true,
        product: 'Product1',
        seller: 'Seller1',
      },
      {
        id: 2,
        business_name: 'Seller 2',
        price: 60,
        in_stock: false,
        product: 'Product2',
        seller: 'Seller2',
      },
    ];

    component.sellers$ = of(sellers);

    fixture.detectChanges();

    const sellerElements =
      fixture.nativeElement.querySelectorAll('.seller-name');
    //  const priceElements = fixture.nativeElement.querySelectorAll('.product-price');
    //const inStockElements = fixture.nativeElement.querySelectorAll('.in-stock-box');

    expect(sellerElements.length).toEqual(sellers.length);
    //  expect(priceElements.length).toEqual(sellers.length);
    //expect(inStockElements.length).toEqual(sellers.length);
  });

  it('should display product information', () => {
    const id = 1;
    const productName = 'Product Name';
    const brand = 'Brand';
    const category = 'Category';
    const description = 'Product Description';
    const minPrice = 100;
    const currencyCode = 'ZAR';

    component.product$ = of({
      id,
      name: productName,
      brand,
      category,
      description,
      min_price: minPrice,
    });
    component.currencyCode = currencyCode;

    fixture.detectChanges();

    const productNameElement = fixture.nativeElement.querySelector('h2');
    const brandElement = fixture.nativeElement.querySelector('h4');
    const descriptionElement = fixture.nativeElement.querySelector('p');
    const minPriceElement =
      fixture.nativeElement.querySelector('product-price');

    expect(productNameElement.textContent).toContain(productName);
    expect(brandElement.textContent).toContain(brand);
    expect(descriptionElement.textContent).toContain(description);
  });
  it('should toggle divClicked and update sellers$', () => {
    // spyOn(productService, 'getSellerList');

    component.divClicked = false;
    component.prod_id = 1;
    component.onlyInStockToggler();
    expect(component.divClicked).toBe(true);
    expect(productService.getSellerList).toHaveBeenCalledWith(1, 'true');
  });

  /*
  it('should navigate to the seller product page on seller name click', () => {
    const sellerId = 1;
    const sellerProductUrl = `/seller/${sellerId}`;

    component.sellers$ = of([{ id: sellerId, product_url: sellerProductUrl,product:'Product1', seller:'Seller1' }]);

    fixture.detectChanges();

    const sellerNameLink = fixture.nativeElement.querySelector('.seller-name a');

    spyOn(router, 'navigateByUrl');

    sellerNameLink.click();

    expect(router.navigateByUrl).toHaveBeenCalledWith(sellerProductUrl);
  });
*/
});
