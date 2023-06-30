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
import { ProductService } from '@app/services/product/product.service';
import { IProduct } from '@app/models/product/product.interface';
import { HttpClientModule } from '@angular/common/http';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';

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
        IonicModule,
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
  it('should add the filter option when checked is true', () => {
    component.filterOptions = [];
    const filter_type = 'filter_category';
    const value = 'electronics';
    const checked = true;

    component.onFilterOptionChange(filter_type, value, checked);

    expect(component.filterOptions).toEqual(['filter_category=electronics']);
  });
  it('should remove the value from the filter option when checked is false', () => {
    // Initial values
    component.filterOptions = ['filter_category=electronics,,,books'];
    const filter_type = 'filter_category';
    const value = 'books';
    const checked = false;

    component.onFilterOptionChange(filter_type, value, checked);
    expect(component.filterOptions).toEqual(['filter_category=electronics']);
  });

  it('should update the existing filter option when checked is true', () => {
    component.filterOptions = ['filter_category=electronics'];
    const filter_type = 'filter_category';
    const value = 'books';
    const checked = true;

    component.onFilterOptionChange(filter_type, value, checked);

    expect(component.filterOptions).toEqual([
      'filter_category=electronics,,,books',
    ]);
  });
});
