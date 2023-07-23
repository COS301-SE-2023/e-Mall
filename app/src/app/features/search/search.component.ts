import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProductService } from '@shared/servicies/product/product.service';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { IProduct } from '@shared/models/product/product.interface';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
interface RangeValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  lower: number;
  upper: number;
}

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery!: string;
  searchResults$: Observable<IProduct[]> | undefined;
  // isAuthenticated!: boolean;
  min_price_in_stock!: number;
  brandOptions: string[] = []; // Populate this array with the brand names based on your search results
  sellerOptions: string[] = []; // Populate this array with the seller names based on your search results
  categoryOptions: string[] = []; // Populate this array with the category names based on your search results
  priceRange: number[] = [0, 100]; // Initial price range
  minPrice!: number; // Minimum price value
  maxPrice!: number; // Maximum price value
  filterOptions: string[] = []; // Stores the selected filter options
  selectedSortOption!: string;
  isChecked!: boolean;
  currentPage!: number;
  maxPrice$: Observable<number> | null = null;
  minPrice$: Observable<number> | null = null;
  itemsPerPage!: number;
  totalSearchCount$: Observable<number> | undefined;

  loading = true;

  ////J fix for min , max price

  priceRangeGroup;

  /////
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private analytics: AnalyticsService
  ) {
    this.priceRangeGroup = new FormGroup({
      lower: new FormControl(0),
      upper: new FormControl(5000),
    });
  }

  ngOnInit(): void {
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'];
      console.log('filter options' + this.filterOptions);
      this.selectedSortOption = 'price';
      this.productService
        .searchProducts(
          this.searchQuery,
          this.filterOptions,
          this.selectedSortOption,
          this.currentPage,
          this.itemsPerPage
        )
        .subscribe(result => {
          this.searchResults$ = of(result.products);
          this.totalSearchCount$ = of(result.totalCount);
          console.log('totalSearchCount$');
          console.log(this.totalSearchCount$);

          // Fetch the brand names from the search results and populate the brandOptions array
          this.searchResults$
            .pipe(
              tap((products: IProduct[]) => {
                const brands = new Set<string>();
                products.forEach(product => {
                  brands.add(product.brand);
                });
                this.brandOptions = Array.from(brands);
              })
            )
            .subscribe();
          this.searchResults$
            .pipe(
              tap((products: IProduct[]) => {
                const categories = new Set<string>();
                products.forEach(product => {
                  categories.add(product.category);
                });
                this.categoryOptions = Array.from(categories);
              })
            )
            .subscribe();

          // Fetch the seller names from the search results and populate the sellerOptions array
          this.searchResults$
            .pipe(
              tap((products: IProduct[]) => {
                const sellers = new Set<string>();
                products.forEach(product => {
                  if (
                    product.min_price_seller_business_name !== undefined &&
                    product.min_price_seller_business_name !== ''
                  ) {
                    sellers.add(product.min_price_seller_business_name);
                  }
                });
                this.sellerOptions = Array.from(sellers).filter(
                  seller => seller
                ); // Filter out empty or falsy values
              })
            )
            .subscribe();
        });
    });
  }
  ngOnDestroy(): void {
    console.log();
  }

  //
  pinFormatter(value: number) {
    return `R${value}`;
  }
  signOut(): void {
    this.router.navigate(['sign-out']);
  }

  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    return imgList[0];
  }

  goToProductPage(prod_id: number): void {
    // Create the navigation extras object with the search query as a parameter

    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };

    this.router.navigate(['products'], navigationextras);
  }

  onSortOptionChange(): void {
    this.productService
      .searchProducts(
        this.searchQuery,
        this.filterOptions,
        this.selectedSortOption,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe(result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
      });

    this.searchResults$?.subscribe((res: IProduct[]) => {
      console.log('getSortedProductList');
      console.log(res);
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    console.log('Page size: ' + event.pageSize);
    console.log('Page index: ' + event.pageIndex);
    this.productService
      .searchProducts(
        this.searchQuery,
        this.filterOptions,
        this.selectedSortOption,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe(result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
        console.log('totalSearchCount$');
        console.log(result.totalCount);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterOptionChange(filter_type: string, value: any, checked: boolean) {
    if (
      filter_type === 'filter_category' ||
      filter_type === 'filter_brand' ||
      filter_type === 'filter_seller'
    ) {
      if (checked) {
        // Check if the filter option already exists in the array
        const existingoptionindex = this.filterOptions.findIndex(option =>
          option.startsWith(`${filter_type}=`)
        );

        if (existingoptionindex > -1) {
          // If the filter option already exists, update it by appending the new value
          const existingoption = this.filterOptions[existingoptionindex];
          const existingvalues = existingoption.split('=')[1].split(',,,');
          existingvalues.push(value);
          this.filterOptions[
            existingoptionindex
          ] = `${filter_type}=${existingvalues.join(',,,')}`;
        } else {
          // If the filter option doesn't exist, add it as a new option
          this.filterOptions.push(`${filter_type}=${value}`);
        }
      } else {
        // Remove the value from the filter option when unchecked
        const existingoptionindex = this.filterOptions.findIndex(option =>
          option.startsWith(`${filter_type}=`)
        );
        if (existingoptionindex > -1) {
          const existingoption = this.filterOptions[existingoptionindex];
          const existingvalues = existingoption.split('=')[1].split(',,,');
          const valueindex = existingvalues.indexOf(value);
          if (valueindex > -1) {
            existingvalues.splice(valueindex, 1);
            if (existingvalues.length === 0) {
              this.filterOptions.splice(existingoptionindex, 1);
            } else {
              this.filterOptions[
                existingoptionindex
              ] = `${filter_type}=${existingvalues.join(',,,')}`;
            }
          }
        }
      }
    } else if (filter_type === 'filter_in_stock') {
      const filteroption = `${filter_type}=true`; // Set the filter option as "filter_in_stock=true"

      if (checked) {
        // Add the filter option if checked is true
        this.filterOptions.push(filteroption);
      } else {
        // Remove the filter option if checked is false
        const index = this.filterOptions.indexOf(filteroption);
        if (index > -1) {
          this.filterOptions.splice(index, 1);
        }
      }
    } else if (
      filter_type === 'filter_price_min' ||
      filter_type === 'filter_price_max'
    ) {
      const filteroption = `${filter_type}=${value}`;

      if (value == null) {
        // Remove the filter option if checked is false
        this.filterOptions = this.filterOptions.filter(
          option => !option.startsWith(`${filter_type}=`)
        );

        // Remove the filter option if checked is false

        const index = this.filterOptions.indexOf(filteroption);
        if (index > -1) {
          this.filterOptions.splice(index, 1);
        }
      } else {
        // // Remove any existing filter option with the same filter type
        this.filterOptions = this.filterOptions.filter(
          option => !option.startsWith(`${filter_type}=`)
        );
        // Add the new filter option
        this.filterOptions.push(filteroption);
      }
    }
    this.productService
      .searchProducts(
        this.searchQuery,
        this.filterOptions,
        this.selectedSortOption,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe(result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
      });
  }

  onIonChange(event: Event) {
    const rangeValue = (event as CustomEvent<RangeValue>).detail.value;
    if (rangeValue) {
      const lower = rangeValue.lower;
      const upper = rangeValue.upper;

      this.onFilterOptionChange('filter_price_min', lower, true);
      this.onFilterOptionChange('filter_price_max', upper, true);
      this.minPrice = lower;
      this.maxPrice = upper;
    }
  }
}
