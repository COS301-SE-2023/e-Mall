/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { InventoryService } from '@features/inventory/servicies/inventory.service';
import { ProductService } from '@shared/servicies/product/product.service';
import { PopoverController } from '@ionic/angular';
import { PopovereditComponent } from './popoveredit/popoveredit.component';
import { IInventoryItem } from '../models/inventory-item.interface';
import { ISearchOptions } from '../models/search-options.interface';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent {
  options = ['All', 'In Stock', 'Out of Stock'];
  searchQuery!: string;
  searchResults$: Observable<IInventoryItem[]> | undefined;
  searchInputController = new FormControl('');
  // isAuthenticated!: boolean;
  categoryOptions: string[] = []; // Populate this array with the category names based on your search results
  filterOptions: string[] = []; // Stores the selected filter options
  selectedSortOption!: string;
  isChecked!: boolean;
  currentPage!: number;
  itemsPerPage!: number;
  totalSearchCount$: Observable<number> | undefined;
  sellerName!: string;
  selectedOption!: string;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private ProductSellerService: InventoryService,
    private popoverController: PopoverController
  ) {}

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    this.route.queryParams.subscribe(() => {
      // this.sellerName = params['seller_name'];
      this.sellerName = 'Takealot';
      this.selectedSortOption = 'name';
      const options: ISearchOptions = {
        name: this.sellerName,
        sortOption: this.selectedSortOption,
      };
      this.ProductSellerService.getProductSellerData(options).subscribe(
        result => {
          this.searchResults$ = of(result.products);
          this.totalSearchCount$ = of(result.totalCount);
        }
      );
    });
  }
  //refresher
  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      window.location.reload();
      event.target.complete();
    }, 2000);
  }

  selectOption(option: string) {
    this.selectedOption = option;
    if (option === 'All') {
      this.onFilterOptionChange('filter_in_stock', undefined, false);
    } else this.onFilterOptionChange('filter_in_stock', option, true);
  }

  onSortOptionChange(): void {
    console.log('onSortOptionChange');
    const options: ISearchOptions = {
      name: this.sellerName,
      search: this.searchQuery,
      filterOptions: this.filterOptions,
      sortOption: this.selectedSortOption,
      page: this.currentPage,
      per_page: this.itemsPerPage,
    };
    this.ProductSellerService.getProductSellerData(options).subscribe(
      result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
      }
    );

    this.searchResults$?.subscribe((res: IInventoryItem[]) => {
      console.log('getSortedProductList');
      console.log(res);
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    const options: ISearchOptions = {
      name: this.sellerName,
      filterOptions: this.filterOptions,
      sortOption: this.selectedSortOption,
      page: this.currentPage,
      per_page: this.itemsPerPage,
    };
    this.ProductSellerService.getProductSellerData(options).subscribe(
      result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
        console.log('totalSearchCount$');
        console.log(result.totalCount);
      }
    );
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
      let filteroption = `${filter_type}=`; // Set the filter option as "filter_in_stock=true"
      if (value == 'In Stock') {
        filteroption += `True`;
      } else if (value == 'Out of Stock') {
        filteroption += `False`;
      }

      if (checked) {
        // Add the filter option if checked is true
        this.filterOptions = [];
        this.filterOptions.push(filteroption);
      } else {
        // Remove the filter option if checked is false
        this.filterOptions = [];
      }
    }
    const options: ISearchOptions = {
      name: this.sellerName,
      filterOptions: this.filterOptions,
      sortOption: this.selectedSortOption,
      page: this.currentPage,
      per_page: this.itemsPerPage,
    };
    this.ProductSellerService.getProductSellerData(options).subscribe(
      result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
      }
    );
  }

  onSearchInputChange() {
    if (this.searchQuery === '') {
      // Call a function or perform an action when the search input is empty
      this.resetSearch();
    }
  }

  resetSearch() {
    // Reset the search query and perform any necessary actions
    this.searchQuery = '';
    // Call the function or perform an action to handle the reset
    this.ngOnInit();
  }

  onSearch() {
    if (this.searchQuery) {
      const options: ISearchOptions = {
        name: this.sellerName,
        search: this.searchQuery,
      };
      this.ProductSellerService.getProductSellerData(options).subscribe(
        result => {
          this.searchResults$ = of(result.products);
          this.totalSearchCount$ = of(result.totalCount);
        }
      );
    }
  }

  keyDownFunction(event: any) {
    if (event.code === 'Enter') {
      //search call
      this.onSearch();
    }
  }

  async selectProduct(product: any) {
    const popover = await this.popoverController.create({
      component: PopovereditComponent,
      componentProps: {
        product: product,
      },
      translucent: true,
    });

    return await popover.present();
  }
}
