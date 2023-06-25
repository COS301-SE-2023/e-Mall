
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '@app/services/product/product.service';
import { of } from 'rxjs';
import { IProduct } from '@app/models/product/product.interface';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HomeRoutingModule } from './home-routing.module';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from '@app/services/auth/auth.service';

import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        CommonModule,
        HomeRoutingModule,
        NgbCarouselModule,
        NavbarModule,
        FooterModule,
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
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
      ],
      providers: [ProductService, AuthService, {
        provide: ActivatedRoute,
        useValue: {
          /* Mock or stub properties/methods you need here */
        },
      },],
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create the HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch popular products on initialization', () => {
    const mockProducts: IProduct[] = [
      {
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
      },
      // Add more mock products as needed...
    ];
    
    spyOn(productService, 'getPopProducts').and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(productService.getPopProducts).toHaveBeenCalled();
    expect(component.popProducts$).toBeDefined();
    component.popProducts$?.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });

  it('should fetch "For You" products on initialization', () => {
    const mockProducts: IProduct[] = [
      {
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
      },
      // Add more mock products as needed...
    ];

    spyOn(productService, 'getForYouProducts').and.returnValue(
      of(mockProducts)
    );

    component.ngOnInit();

    expect(productService.getForYouProducts).toHaveBeenCalled();
    expect(component.forYouProducts$).toBeDefined();
    component.forYouProducts$?.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });

it('should navigate to search results on search', async () => {
  spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

  await component.search('search query');

  expect(router.navigate).toHaveBeenCalledWith(['/search-results'], {
    queryParams: { search: 'search query' },
  });
});

  it('should navigate to product page on click', () => {
    const productId = 1;
    spyOn(router, 'navigate');

    component.goToProductPage(productId);

    expect(router.navigate).toHaveBeenCalledWith(['products'], {
      queryParams: { prod_id: productId },
    });
  });
});