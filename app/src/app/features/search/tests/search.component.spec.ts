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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { SearchComponent } from '../search.component';
import { ProductService } from '@shared/servicies/product/product.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ProductCardModule } from '@shared/components/product-card/product-card.module';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { AuthModule } from '../../auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { ComboStateModule } from '@features/combo-state/combo-state.module';
import { NotificationModule } from '@app/features/notification/notification.module';
import { WishlistStateModule } from '@app/features/wishlist/wishlist-state/wishlist-state.module';

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
        ComboStateModule,
        IonicModule,
        NgxsModule.forRoot([]),
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
        NotificationModule,
        WishlistStateModule,
      ],
      providers: [
        ProductService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductService, useValue: mockProductService },
        AnalyticsService,
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

  describe('onFilterOptionChange', () => {
    it('should add the filter option when checked is true', () => {
      component.filterOptions = [];
      const filter_type = 'filter_category';
      const value = 'electronics';
      const checked = true;

      component.onFilterOptionChange(filter_type, value, checked);

      expect(component.filterOptions).toEqual(['filter_category=electronics']);
    });

    it('should remove the value from the filter option when checked is false', () => {
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

    it('should add the filter option when filter_type is filter_in_stock and checked is true', () => {
      component.filterOptions = [];
      const filter_type = 'filter_in_stock';
      const checked = true;

      component.onFilterOptionChange(filter_type, null, checked);

      expect(component.filterOptions).toEqual(['filter_in_stock=true']);
    });

    it('should remove the filter option when filter_type is filter_in_stock and checked is false', () => {
      component.filterOptions = ['filter_in_stock=true'];
      const filter_type = 'filter_in_stock';
      const checked = false;

      component.onFilterOptionChange(filter_type, null, checked);

      expect(component.filterOptions).toEqual([]);
    });

    it('should add the filter option when filter_type is filter_price_min or filter_price_max and value is not null', () => {
      component.filterOptions = [];
      const filter_type = 'filter_price_min';
      const value = 50;

      component.onFilterOptionChange(filter_type, value, true);

      expect(component.filterOptions).toEqual(['filter_price_min=50']);

      const filter_type2 = 'filter_price_max';
      const value2 = 100;

      component.onFilterOptionChange(filter_type2, value2, true);

      expect(component.filterOptions).toEqual([
        'filter_price_min=50',
        'filter_price_max=100',
      ]);
    });

    it('should remove the filter option when filter_type is filter_price_min or filter_price_max and value is null', () => {
      component.filterOptions = ['filter_price_min=50', 'filter_price_max=100'];
      const filter_type = 'filter_price_min';
      const value = null;

      component.onFilterOptionChange(filter_type, value, true);

      expect(component.filterOptions).toEqual(['filter_price_max=100']);

      const filter_type2 = 'filter_price_max';
      const value2 = null;

      component.onFilterOptionChange(filter_type2, value2, true);

      expect(component.filterOptions).toEqual([]);
    });
  });

  describe('onIonChange', () => {
    it('should update the filter options and minPrice/maxPrice', () => {
      const event = {
        detail: {
          value: {
            lower: 50,
            upper: 100,
          },
        },
      };

      spyOn(component, 'onFilterOptionChange');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.onIonChange(event as any);

      expect(component.onFilterOptionChange).toHaveBeenCalledWith(
        'filter_price_min',
        50,
        true
      );
      expect(component.onFilterOptionChange).toHaveBeenCalledWith(
        'filter_price_max',
        100,
        true
      );
      expect(component.minPrice).toBe(50);
      expect(component.maxPrice).toBe(100);
    });
  });
});
