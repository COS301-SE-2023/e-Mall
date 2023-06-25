/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from './search.component';
import { Router } from '@angular/router';

import { SearchRoutingModule as SearchRoutingModule } from './search-routing.module';
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
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        CommonModule,
        SearchRoutingModule,
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
      declarations: [SearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  /*
  it('should navigate to product page with correct navigation extras', () => {
    const prodId = 123;
    const navigationExtras = {
      queryParams: { prod_id: prodId },
    };
    const navigateSpy = spyOn(router, 'navigate');

    component.goToProductPage(prodId);

    expect(navigateSpy).toHaveBeenCalledWith(['products', prodId], navigationExtras);
  });

  it('should initialize searchQuery and subscribe to searchResults$', () => {
    const searchQuery = 'test';
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
        updated_at: '2023-06-02'
      },
      {
        id: 2,
        min_price_img_array: ['image3.jpg', 'image4.jpg'],
        name: 'Product 2',
        description: 'Description 2',
        brand: 'Brand 2',
        category: 'Category 2',
        min_price: 15,
        min_price_seller_id: 'seller2',
        min_price_seller_product_url: 'seller2.com/product2',
        min_price_seller_business_name: 'Seller 2',
        min_price_in_stock: false,
        min_price_discount: 0,
        min_price_discount_rate: 0,
        min_price_original_price: 15,
        created_at: '2023-06-03',
        updated_at: '2023-06-04'
      },
      {
        id: 3,
        min_price_img_array: ['image5.jpg', 'image6.jpg'],
        name: 'Product 3',
        description: 'Description 3',
        brand: 'Brand 3',
        category: 'Category 3',
        min_price: 25,
        min_price_seller_id: 'seller3',
        min_price_seller_product_url: 'seller3.com/product3',
        min_price_seller_business_name: 'Seller 3',
        min_price_in_stock: true,
        min_price_discount: 10,
        min_price_discount_rate: 0.4,
        min_price_original_price: 35,
        created_at: '2023-06-05',
        updated_at: '2023-06-06'
      }
    ];

    const productService = TestBed.inject(ProductService);
    spyOn(productService, 'searchProducts').and.returnValue(of(mockProducts));

    fixture.ngZone?.run(() => {
      router.navigate([{ search: searchQuery }]);
      fixture.detectChanges();

      expect(component.searchQuery).toEqual(searchQuery);
      expect(productService.searchProducts).toHaveBeenCalledWith(searchQuery);
      component.searchResults$?.subscribe((results) => {
        expect(results).toEqual(mockProducts);
      });
    });
  });

  it('should populate brandOptions array based on search results', () => {
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
        updated_at: '2023-06-02'
      },
      {
        id: 2,
        min_price_img_array: ['image3.jpg', 'image4.jpg'],
        name: 'Product 2',
        description: 'Description 2',
        brand: 'Brand 2',
        category: 'Category 2',
        min_price: 15,
        min_price_seller_id: 'seller2',
        min_price_seller_product_url: 'seller2.com/product2',
        min_price_seller_business_name: 'Seller 2',
        min_price_in_stock: false,
        min_price_discount: 0,
        min_price_discount_rate: 0,
        min_price_original_price: 15,
        created_at: '2023-06-03',
        updated_at: '2023-06-04'
      },
      {
        id: 3,
        min_price_img_array: ['image5.jpg', 'image6.jpg'],
        name: 'Product 3',
        description: 'Description 3',
        brand: 'Brand 3',
        category: 'Category 3',
        min_price: 25,
        min_price_seller_id: 'seller3',
        min_price_seller_product_url: 'seller3.com/product3',
        min_price_seller_business_name: 'Seller 3',
        min_price_in_stock: true,
        min_price_discount: 10,
        min_price_discount_rate: 0.4,
        min_price_original_price: 35,
        created_at: '2023-06-05',
        updated_at: '2023-06-06'
      }
    ];

    spyOn(component.searchResults$ as any, 'pipe').and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(component.brandOptions).toEqual(['Brand 1', 'Brand 2', 'Brand 3']);
  });

  it('should populate sellerOptions array based on search results', () => {
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
        updated_at: '2023-06-02'
      },
      {
        id: 2,
        min_price_img_array: ['image3.jpg', 'image4.jpg'],
        name: 'Product 2',
        description: 'Description 2',
        brand: 'Brand 2',
        category: 'Category 2',
        min_price: 15,
        min_price_seller_id: 'seller2',
        min_price_seller_product_url: 'seller2.com/product2',
        min_price_seller_business_name: 'Seller 2',
        min_price_in_stock: false,
        min_price_discount: 0,
        min_price_discount_rate: 0,
        min_price_original_price: 15,
        created_at: '2023-06-03',
        updated_at: '2023-06-04'
      },
      {
        id: 3,
        min_price_img_array: ['image5.jpg', 'image6.jpg'],
        name: 'Product 3',
        description: 'Description 3',
        brand: 'Brand 3',
        category: 'Category 3',
        min_price: 25,
        min_price_seller_id: 'seller3',
        min_price_seller_product_url: 'seller3.com/product3',
        min_price_seller_business_name: 'Seller 3',
        min_price_in_stock: true,
        min_price_discount: 10,
        min_price_discount_rate: 0.4,
        min_price_original_price: 35,
        created_at: '2023-06-05',
        updated_at: '2023-06-06'
      }
    ];

    spyOn(component.searchResults$ as any, 'pipe').and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(component.sellerOptions).toEqual(['Seller 1', 'Seller 2', 'Seller 3']);
  });

  it('should navigate to the product page when a product card is clicked', () => {
    const prodId = 123;
    const navigateSpy = spyOn(router, 'navigate');

    component.goToProductPage(prodId);

    expect(navigateSpy).toHaveBeenCalledWith(['products', prodId], jasmine.any(Object));
  });

  it('should update category flags when category checkboxes are selected', () => {
    const categoryCheckboxes = fixture.nativeElement.querySelectorAll('.category-checkbox');
    const electronicsCheckbox = categoryCheckboxes[0] as HTMLInputElement;
    const clothingCheckbox = categoryCheckboxes[1] as HTMLInputElement;

    electronicsCheckbox.click();
    fixture.detectChanges();
    expect(component.categoryElectronics).toBe(true);

    clothingCheckbox.click();
    fixture.detectChanges();
    expect(component.categoryClothing).toBe(true);
  });*/
});
