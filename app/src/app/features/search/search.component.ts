import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@app/services/product/product.service';
import { IProduct } from '@app/models/product/product.interface';
import { Router, NavigationExtras } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable, map, of, BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { result } from 'cypress/types/lodash';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'cypress/types/bluebird';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchQuery!: string;
  searchResults$: Observable<IProduct[]> | undefined;
  isAuthenticated!: boolean;
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
  currentPage$ = new BehaviorSubject<number>(0);
  maxPrice$: Observable<number> | null = null;
  minPrice$: Observable<number> | null = null;
  itemsPerPage$ = new BehaviorSubject<number>(10);
  totalSearchCount$: Observable<number> | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'];
      console.log('filter options' + this.filterOptions);
      this.productService
        .searchProducts(
          this.searchQuery,
          this.filterOptions,
          this.selectedSortOption,
          this.currentPage$.value,
          this.itemsPerPage$.value
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

  //

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
    console.log(prod_id);

    this.router.navigate(['products'], navigationextras);
  }

  onSortOptionChange(): void {
    this.productService
      .searchProducts(this.searchQuery, null, this.selectedSortOption)
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
    this.currentPage$.next(event.pageIndex + 1);
    this.itemsPerPage$.next(event.pageSize);
    console.log('Page size: ' + event.pageSize);
    console.log('Page index: ' + event.pageIndex);
    this.updateQueryParams();
    this.productService
      .searchProducts(
        this.searchQuery,
        this.filterOptions,
        this.selectedSortOption,
        this.currentPage$.value,
        this.itemsPerPage$.value
      )
      .subscribe(result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
        console.log('totalSearchCount$');
        console.log(result.totalCount);
      });
  }
  updateQueryParams() {
    this.router.navigate([], {
      queryParams: {
        page: this.currentPage$.value,
        per_page: this.itemsPerPage$.value,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

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
      filter_type === 'filter_min_price' ||
      filter_type === 'filter_max_price'
    ) {
      const filteroption = `${filter_type}=${value}`;

      if (value == null) {
        console.log('if value is null: ' + this.filterOptions);
        // Remove the filter option if checked is false
        const index = this.filterOptions.indexOf(filteroption);
        if (index > -1) {
          this.filterOptions.splice(index, 1);
        }
      } else {
        console.log('should be a min_price: ' + this.filterOptions);
        // // Remove any existing filter option with the same filter type
        this.filterOptions = this.filterOptions.filter(
          option => !option.startsWith(`${filter_type}=`)
        );
        console.log('should be empty: ' + this.filterOptions);
        // Add the new filter option
        this.filterOptions.push(filteroption);
        console.log('should be min_price: ' + this.filterOptions);
      }
    }
    console.log(
      'filter Options after all filters applied: ' + this.filterOptions
    );
    this.productService
      .searchProducts(
        this.searchQuery,
        this.filterOptions,
        this.selectedSortOption
      )
      .subscribe(result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
      });
  }
}
