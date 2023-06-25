/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { ProductService } from '@app/services/product/product.service';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ActivatedRoute, Router } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
        NavbarModule,
        FooterModule,
      ],
      declarations: [ProductComponent],
      providers: [
        ProductService,
        {
          provide: ActivatedRoute,
          useValue: {
            /* Mock or stub properties/methods you need here */
          },
        },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
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

  /*
  it('should fetch product data and seller list on initialization', () => {
    const productData = {  id: 1,
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
      updated_at: '2023-06-02', };
      const sellerList: IProductSeller[] = [{ id: 1, product: null, seller: null }, { id: 2, product: null, seller: null }];

    jest.spyOn(productService, 'getProductData').mockReturnValueOnce(of(productData));
    jest.spyOn(productService, 'getSellerList').mockReturnValueOnce(of(sellerList));

    component.ngOnInit();

    expect(productService.getProductData).toHaveBeenCalledWith(component.id);
    expect(productService.getSellerList).toHaveBeenCalledWith(component.id);
    expect(component.product$).toEqual(of(productData));
    expect(component.sellers$).toEqual(of(sellerList));
  });

  it('should display product information', () => {
    const productName = 'Product Name';
    const brand = 'Brand';
    const description = 'Product Description';
    const minPrice = 100;
    const currencyCode = 'ZAR';

    component.product$ = of({ name: productName, brand, description, min_price: minPrice });
    component.currencyCode = currencyCode;

    fixture.detectChanges();

    const productNameElement = fixture.nativeElement.querySelector('.product-name');
    const brandElement = fixture.nativeElement.querySelector('h4');
    const descriptionElement = fixture.nativeElement.querySelector('p');
    const minPriceElement = fixture.nativeElement.querySelector('.product-price');

    expect(productNameElement.textContent).toContain(productName);
    expect(brandElement.textContent).toContain(brand);
    expect(descriptionElement.textContent).toContain(description);
    expect(minPriceElement.textContent).toContain(`${minPrice} ${currencyCode}`);
  });

  it('should display seller list', () => {
    const sellers = [
      { id: 1, business_name: 'Seller 1', price: 50, in_stock: true },
      { id: 2, business_name: 'Seller 2', price: 60, in_stock: false }
    ];

    component.sellers$ = of(sellers);

    fixture.detectChanges();

    const sellerElements = fixture.nativeElement.querySelectorAll('.seller-name');
    const priceElements = fixture.nativeElement.querySelectorAll('.product-price');
    const inStockElements = fixture.nativeElement.querySelectorAll('.in-stock-box');

    expect(sellerElements.length).toEqual(sellers.length);
    expect(priceElements.length).toEqual(sellers.length);
    expect(inStockElements.length).toEqual(sellers.length);
  });

  it('should navigate to the seller product page on seller name click', () => {
    const sellerId = 1;
    const sellerProductUrl = `/seller/${sellerId}`;

    component.sellers$ = of([{ id: sellerId, product_url: sellerProductUrl }]);

    fixture.detectChanges();

    const sellerNameLink = fixture.nativeElement.querySelector('.seller-name a');

    const navigateByUrlSpy = jest.spyOn(component['router'], 'navigateByUrl');

    sellerNameLink.click();

    expect(navigateByUrlSpy).toHaveBeenCalledWith(sellerProductUrl);
  });*/
});
