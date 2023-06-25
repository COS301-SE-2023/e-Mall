/* eslint-disable @typescript-eslint/naming-convention */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

import { SearchComponent } from './search.component';
import { ProductService } from '@app/services/product/product.service';
import { IProduct } from '@app/models/product/product.interface';
import { HttpClientModule } from '@angular/common/http'; 
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let productService: ProductService;
  let router: Router;

  const mockActivatedRoute = {
    queryParams: of({ search: 'test' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        NavbarModule,
        FooterModule,
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
      ],
      providers: [
        ProductService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the SearchComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display search results on initialization', () => {
    const mockProducts: IProduct[] = [
      {
        id: 1,
        name: 'Product 1',
        category: 'Category 1',
        brand: 'Brand 1',
        min_price: 10,
      },
      {
        id: 2,
        name: 'Product 2',
        category: 'Category 2',
        brand: 'Brand 2',
        min_price: 20,
      },
    ];
    

    spyOn(productService, 'searchProducts').and.returnValue(
      of({
        products: mockProducts,
        totalCount: mockProducts.length,
      })
    );

    component.ngOnInit();

    expect(productService.searchProducts).toHaveBeenCalledWith(
      'test',
      [],
      undefined,
      0,
      component.itemsPerPage
    );

    fixture.detectChanges();

    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(mockProducts.length);

    for (let i = 0; i < mockProducts.length; i++) {
      const productElement = productElements[i].nativeElement;
      expect(productElement.textContent).toContain(mockProducts[i].name);
      expect(productElement.textContent).toContain(mockProducts[i].category);
      expect(productElement.textContent).toContain(mockProducts[i].min_price);
    }
  });

  it('should navigate to product page on click', () => {
    const productId = 1;
    spyOn(router, 'navigate');

    component.goToProductPage(productId);

    expect(router.navigate).toHaveBeenCalledWith(['products'], {
      queryParams: { prod_id: productId },
    });
  });
  

  it('should apply brand filter option', () => {
    const brandOption = 'Brand 1';
    const mockProducts: IProduct[] = [
      { id: 1, name: 'Product 1', category: 'Category 1', brand: brandOption, min_price: 10 },
      { id: 2, name: 'Product 2', category: 'Category 2', brand: 'Brand 2', min_price: 20 },
    ];

    spyOn(productService, 'searchProducts').and.returnValue(
      of({
        products: mockProducts,
        totalCount: mockProducts.length,
      })
    );

    component.ngOnInit();

    fixture.detectChanges();

    const brandCheckbox = fixture.debugElement.query(By.css(`[value="${brandOption}"]`));
    brandCheckbox.triggerEventHandler('change', { target: { checked: true } });

    expect(productService.searchProducts).toHaveBeenCalledWith(
      'test',
      ['filter_brand=Brand 1'],
      undefined,
      0,
      component.itemsPerPage
    );

    fixture.detectChanges();

    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(1);
    expect(productElements[0].nativeElement.textContent).toContain('Product 1');
  });

  it('should apply category filter option', () => {
    const categoryOption = 'Category 1';
    const mockProducts: IProduct[] = [
      {
        id: 1,
        name: 'Product 1',
        category: 'Category 1',
        brand: 'Brand 1',
        min_price: 10,
      },
      {
        id: 2,
        name: 'Product 2',
        category: 'Category 2',
        brand: 'Brand 2',
        min_price: 20,
      },
    ];
    

    spyOn(productService, 'searchProducts').and.returnValue(
      of({
        products: mockProducts,
        totalCount: mockProducts.length,
      })
    );

    component.ngOnInit();

    fixture.detectChanges();

    const categoryCheckbox = fixture.debugElement.query(By.css(`[value="${categoryOption}"]`));
    categoryCheckbox.triggerEventHandler('change', { target: { checked: true } });

    expect(productService.searchProducts).toHaveBeenCalledWith(
      'test',
      [],   
      undefined,
      0,
      component.itemsPerPage
    );

    fixture.detectChanges();

    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(1);
    expect(productElements[0].nativeElement.textContent).toContain('Product 1');
  });

  it('should update search results on sort option change', () => {
    const sortOption = 'price';
    const mockProducts: IProduct[] = [
      {
        id: 1,
        name: 'Product 1',
        category: 'Category 1',
        brand: 'Brand 1',
        min_price: 10,
      },
      {
        id: 2,
        name: 'Product 2',
        category: 'Category 2',
        brand: 'Brand 2',
        min_price: 20,
      },
    ];
    

    spyOn(productService, 'searchProducts').and.returnValues(
      of({
        products: mockProducts,
        totalCount: mockProducts.length,
      }),
      of({
        products: mockProducts.reverse(),
        totalCount: mockProducts.length,
      })
    );

    component.ngOnInit();

    fixture.detectChanges();

    const sortSelect = fixture.debugElement.query(By.css('.custom-select')).nativeElement;
    sortSelect.value = sortOption;
    sortSelect.dispatchEvent(new Event('change'));

    expect(productService.searchProducts).toHaveBeenCalledWith(
      'test',
      [],
      undefined,
      undefined,
      component.itemsPerPage
    );

    fixture.detectChanges();

    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(mockProducts.length);
    expect(productElements[0].nativeElement.textContent).toContain('Product 2');
    expect(productElements[1].nativeElement.textContent).toContain('Product 1');
  });

  it('should update search results on page change', () => {
    const currentPage = 1;
    const itemsPerPage = 10;
    const mockProducts: IProduct[] = [
      {
        id: 1,
        name: 'Product 1',
        category: 'Category 1',
        brand: 'Brand 1',
        min_price: 10,
      },
      {
        id: 2,
        name: 'Product 2',
        category: 'Category 2',
        brand: 'Brand 2',
        min_price: 20,
      },
    ];
    
    spyOn(productService, 'searchProducts').and.returnValue(
      of({
        products: mockProducts,
        totalCount: mockProducts.length,
      })
    );

    component.ngOnInit();

    fixture.detectChanges();

    const pageEvent: PageEvent = {
      pageIndex: 0,
      pageSize: 10,
      length: 100,
    };
    
    component.onPageChange(pageEvent);

    expect(productService.searchProducts).toHaveBeenCalledWith(
      'test',
      [],
      undefined,
      currentPage,
      itemsPerPage
    );

    fixture.detectChanges();

    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(mockProducts.length);
  });

  it('should apply in-stock filter option', () => {
    const mockProducts: IProduct[] = [
      {
        id: 1,
        name: 'Product 1',
        category: 'Category 1',
        brand: 'Brand 1',
        min_price: 10,
      },
      {
        id: 2,
        name: 'Product 2',
        category: 'Category 2',
        brand: 'Brand 2',
        min_price: 20,
      },
    ];
    
    spyOn(productService, 'searchProducts').and.returnValue(
      of({
        products: mockProducts,
        totalCount: mockProducts.length,
      })
    );

    component.ngOnInit();

    fixture.detectChanges();

    const inStockToggle = fixture.debugElement.query(By.css('.mat-slide-toggle')).nativeElement;
    inStockToggle.click();

    expect(productService.searchProducts).toHaveBeenCalledWith(
      'test',
      [],
      undefined,
      undefined,
      component.itemsPerPage
    );

    fixture.detectChanges();

    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(1);
    expect(productElements[0].nativeElement.textContent).toContain('Product 1');
  });

  it('should update search results on minimum price change', () => {
    const minPrice = 10;
    const mockProducts: IProduct[] = [
      {
        id: 1,
        name: 'Product 1',
        category: 'Category 1',
        brand: 'Brand 1',
        min_price: 10,
      },
      {
        id: 2,
        name: 'Product 2',
        category: 'Category 2',
        brand: 'Brand 2',
        min_price: 20,
      },
    ];
    

    spyOn(productService, 'searchProducts').and.returnValue(
      of({
        products: mockProducts,
        totalCount: mockProducts.length,
      })
    );
  
    component.ngOnInit();
  
    fixture.detectChanges();
  
    const minPriceInput = fixture.debugElement.query(By.css('input[placeholder="Minimum Price"]')).nativeElement;
    minPriceInput.value = minPrice;
    minPriceInput.dispatchEvent(new Event('input'));
  
    fixture.detectChanges();
  
    expect(productService.searchProducts).toHaveBeenCalledWith(
      'test',
      [],
      undefined,
      undefined,
      component.itemsPerPage
    );
  
    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(1);
    expect(productElements[0].nativeElement.textContent).toContain('Product 2');
  });

  it('should update search results on maximum price change', () => {
    const maxPrice = 20;
    const mockProducts: IProduct[] = [
      {
        id: 1,
        name: 'Product 1',
        category: 'Category 1',
        brand: 'Brand 1',
        min_price: 10,
      },
      {
        id: 2,
        name: 'Product 2',
        category: 'Category 2',
        brand: 'Brand 2',
        min_price: 20,
      },
    ];
    

    spyOn(productService, 'searchProducts').and.returnValue(
      of({
        products: mockProducts,
        totalCount: mockProducts.length,
      })
    );

    component.ngOnInit();

    fixture.detectChanges();

    const maxPriceInput = fixture.debugElement.query(By.css('input[placeholder="Maximum Price"]')).nativeElement;
    maxPriceInput.value = maxPrice;
    maxPriceInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(productService.searchProducts).toHaveBeenCalledWith(
      'test',
      [],
      undefined,
      undefined,
      component.itemsPerPage
    );

    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(1);
    expect(productElements[0].nativeElement.textContent).toContain('Product 1');
  });

  it('should navigate to sign-out page on signOut method', () => {
    spyOn(router, 'navigate');
    component.signOut();
    expect(router.navigate).toHaveBeenCalledWith(['sign-out']);
  });
});































/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from './search.component';
import { Router } from '@angular/router';
import { IProduct } from '@app/models/product/product.interface';
import { ProductService } from '@app/services/product/product.service';
import { of } from 'rxjs';

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
      imports: 
      [BrowserAnimationsModule,
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
  });

});*/
