/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { of, BehaviorSubject, Observable } from 'rxjs';
import { By } from '@angular/platform-browser';

import { SearchComponent } from '../search.component';
import { ProductService } from '@shared/servicies/product/product.service';
import { IProduct } from '@shared/models/product/product.interface';
import { HttpClientModule } from '@angular/common/http';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ProductCardModule } from '@shared/components/product-card/product-card.module';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let productService: ProductService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const mockProductService = {
      searchProducts: jasmine.createSpy('searchProducts').and.returnValue(
        of({
          products: [
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
          ],
          totalCount: 1,
        })
      ),
    };

    const mockActivatedRoute = {
      queryParams: of({ search: 'a' }),
    };

    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        NavbarModule,
        FooterModule,
        ProductCardModule,
        HttpClientModule,
        NgxsModule.forRoot([]),
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
        IonicModule,
      ],
      providers: [
        ProductService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();
    productService = TestBed.inject(ProductService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create the SearchComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch search results on initialization', () => {
    expect(productService.searchProducts).toHaveBeenCalledWith(
      'a',
      [],
      'price',
      undefined,
      undefined
    );

    expect(component.searchResults$).toBeTruthy();
    // expect(component.totalSearchCount$).toBeTruthy();

    component.searchResults$?.subscribe((results: IProduct[]) => {
      expect(results.length).toBe(1);

      const productElement = fixture.debugElement.query(
        By.css('.product-card')
      ).nativeElement;
      expect(productElement.textContent).toContain('Product 1');
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

  it('should update filter options and fetch search results on filter change', () => {
    component.onFilterOptionChange('filter_category', 'Category 1', true);

    expect(component.filterOptions).toContain('filter_category=Category 1');

    expect(productService.searchProducts).toHaveBeenCalledWith(
      'a',
      component.filterOptions,
      'price',
      undefined,
      undefined
    );
  });

  it('should update sort option and fetch search results on sort change', () => {
    component.selectedSortOption = 'name_asc';
    spyOn(component, 'onSortOptionChange').and.callThrough();

    component.onSortOptionChange();

    expect(component.onSortOptionChange).toHaveBeenCalled();
    expect(productService.searchProducts).toHaveBeenCalledWith(
      'a',
      [],
      'name_asc',
      undefined,
      undefined
    );
  });

  it('should update current page and fetch search results on page change', () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 20 };

    component.onPageChange(pageEvent);

    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(10);
    expect(productService.searchProducts).toHaveBeenCalledWith(
      'a',
      [],
      'price',
      1,
      10
    );
  });
  it('should navigate to sign-out page on signOut method', () => {
    spyOn(router, 'navigate');
    component.signOut();
    expect(router.navigate).toHaveBeenCalledWith(['sign-out']);
  });

  it('should return the first image URL when imgList is provided', () => {
    const imgList = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
    const result = component.getOneImg(imgList);
    expect(result).toEqual('image1.jpg');
  });

  it('should return a default image URL when imgList is not provided or empty', () => {
    const result = component.getOneImg();
    expect(result).toEqual(
      'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg'
    );
  });
});
