import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IProduct } from '@shared/models/product/product.interface';
import { tap } from 'rxjs/operators';
import {
  Observable,
  of,
  debounceTime,
  distinctUntilChanged,
  Subscription,
} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ProductSellerService } from '@shared/servicies/productseller/productseller.service';
import { IProductSeller } from '@shared/models/product/product-seller.interface';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent {
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private ProductSellerService: ProductSellerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.sellerName = params['seller_name'];
      this.ProductSellerService.getProductSellerData(this.sellerName).subscribe(
        result => {
          this.searchResults$ = of(result.products);
          this.totalSearchCount$ = of(result.totalCount);
          this.searchResults$
            .pipe(
              tap((products: IProductSeller[]) => {
                const categories = new Set<string>();
                products.forEach(product => {
                  categories.add(product.product_category);
                });
                this.categoryOptions = Array.from(categories);
              })
            )
            .subscribe();
        }
      );
    });
    this.minInputControllerSub = this.minInputController.valueChanges
      .pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe(val =>
        this.onFilterOptionChange('filter_price_min', val, true)
      );
    this.maxInputControllerSub = this.maxInputController.valueChanges
      .pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe(val =>
        this.onFilterOptionChange('filter_price_max', val, true)
      );
  }

  ngOnDestroy(): void {
    this.minInputControllerSub.unsubscribe();
    this.maxInputControllerSub.unsubscribe();
  }

  onSortOptionChange(): void {
    this.ProductSellerService.getProductSellerData(
      this.searchQuery,
      undefined,
      this.filterOptions,
      this.selectedSortOption,
      this.currentPage,
      this.itemsPerPage
    ).subscribe(result => {
      this.searchResults$ = of(result.products);
      this.totalSearchCount$ = of(result.totalCount);
    });

    this.searchResults$?.subscribe((res: IProductSeller[]) => {
      console.log('getSortedProductList');
      console.log(res);
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    console.log('Page size: ' + event.pageSize);
    console.log('Page index: ' + event.pageIndex);
    this.ProductSellerService.getProductSellerData(
      this.sellerName,
      undefined,
      this.filterOptions,
      this.selectedSortOption,
      this.currentPage,
      this.itemsPerPage
    ).subscribe(result => {
      this.searchResults$ = of(result.products);
      this.totalSearchCount$ = of(result.totalCount);
      console.log('totalSearchCount$');
      console.log(result.totalCount);
    });
  }

  checkInputValidity(formControl: FormControl) {
    if (formControl.value < 0) {
      formControl.setErrors({ negativeNumber: true });
    } else {
      formControl.setErrors(null);
    }
  }

  onFilterOptionChange(filter_type: string, value: any, checked: boolean) {
    if (filter_type === 'filter_category') {
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
    this.ProductSellerService.getProductSellerData(
      this.sellerName,
      undefined,
      this.filterOptions,
      this.selectedSortOption,
      this.currentPage,
      this.itemsPerPage
    ).subscribe(result => {
      this.searchResults$ = of(result.products);
      this.totalSearchCount$ = of(result.totalCount);
    });
  }

  onSearch(query: any) {
    this.searchQuery = query;
    this.ProductSellerService.getProductSellerData(
      undefined,
      this.searchQuery,
      this.filterOptions,
      this.selectedSortOption,
      this.currentPage,
      this.itemsPerPage
    ).subscribe(result => {
      this.searchResults$ = of(result.products);
      this.totalSearchCount$ = of(result.totalCount);
    });
  }

  onProductUpdate() {
    //Json file containing updated product data
    const data = {
      product_id: 1,
    };
    this.ProductSellerService.updateProductSellerData(data).subscribe();
  }

  onProductDelete() {
    const data = {
      product_id: 1,
    };
    this.ProductSellerService.deleteProductSellerData(data).subscribe();
  }
}

