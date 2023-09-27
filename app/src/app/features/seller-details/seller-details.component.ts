/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ProductSellerService } from '@shared/servicies/productseller/productseller.service';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { ProductService } from '@shared/servicies/product/product.service';
import { PopoverController } from '@ionic/angular';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { ISeller } from '@shared/models/seller/seller.interface';
import { SellerService } from '@shared/servicies/seller/seller.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { SellerDataResolver } from './seller-details-resolver';
import { IProduct } from '@shared/models/product/product.interface';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-inventory',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.scss'],
})
export class SellerDetailsComponent implements OnInit, OnDestroy {
  buttonText = 'Follow';
  seller$: Observable<ISeller> = of();
  seller_business_name!: string;
  seller_id!: string | null;
  is_followed?: boolean;
  searchQuery!: string;
  searchResults$: Observable<IProductSeller[]> | undefined;
  searchInputController = new FormControl('');
  // isAuthenticated!: boolean;
  categoryOptions: string[] = []; // Populate this array with the category names based on your search results
  filterOptions: string[] = []; // Stores the selected filter options
  selectedSortOption!: string;
  currentPage!: number;
  itemsPerPage = 10;
  totalSearchCount$: Observable<number> | undefined;
  searchKeyword!: string;
  isFollowed = of(false);
  selectedCategories!: string[];
  // Define the array of categories
  categories: string[] = [
    'Books',
    'Clothing',
    'Electronics',
    'Health and Beauty',
    'Home and Kitchen',
    'Sports and Outdoors',
    'Toys and Games',
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() sellerID: any;
  showSpinner = true;

  private paramMapSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private ProductSellerService: ProductSellerService,
    private popoverController: PopoverController,
    private profileFacade: ProfileFacade,
    private sellerService: SellerService
  ) {
    this.paramMapSubscription = new Subscription();
    this.seller_id = '';
    this.seller_business_name = '';
  }

  ngOnInit(): void {
    this.showSpinner = true;

    setTimeout(() => {
      this.showSpinner = false;
    }, 6000);

    // Subscribe to changes in the query parameters (seller_id)
    this.paramMapSubscription = this.route.queryParamMap
      .pipe(
        switchMap(params => {
          this.seller_id = params.get('seller_id');
          if (this.seller_id) {
            const data = {
              seller_id: this.seller_id,
            };
            // Return the observable for getSellerData
            return this.sellerService.getSellerData(data);
          } else {
            // If there's no seller_id, return an observable with null value
            return of(null);
          }
        }),
        // Use switchMap again to wait for the result of getSellerData before fetching the profile data
        switchMap((res: ISeller | null) => {
          if (res) {
            this.seller$ = of(res);
            this.seller_business_name = res.business_name;
          }
          this.isFollowed = this.profileFacade.checkFollowedSellers(
            this.seller_business_name
          );
          // Fetch the profile data and return the observable
          return this.profileFacade.getProfile();
        }),
        // // Use take(1) to ensure the observable completes after the first emission
        // take(1),
        // Use tap to fetch the products based on the latest seller_business_name
        tap(() => {
          this.selectedSortOption = 'name';

          this.ProductSellerService.getProductSellerData(
            this.seller_business_name,
            undefined,
            undefined,
            this.selectedSortOption,
            undefined,
            undefined
          ).subscribe(result => {
            this.searchResults$ = of(result.products);
            this.totalSearchCount$ = of(result.totalCount);
          });
        })
      )
      .subscribe();
  }

  updateButtonState() {
    this.profileFacade.toggleSellers(this.seller_business_name);
  }

  onSortOptionChange(): void {
    this.ProductSellerService.getProductSellerData(
      this.seller_business_name,
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

  onPageChange(event: PageEvent) {
    this.itemsPerPage += 10;

    this.ProductSellerService.getProductSellerData(
      this.seller_business_name,
      undefined,
      this.filterOptions,
      this.selectedSortOption,
      this.currentPage,
      this.itemsPerPage
    )
      .pipe(take(1))
      .subscribe(result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
      });
  }
  onFilterOptionChange(filter_type: string, value: any) {
    if (filter_type === 'filter_category') {
      // Check if the filter option already exists in the array
      const existingOptionIndex = this.filterOptions.findIndex(option =>
        option.startsWith(`${filter_type}=`)
      );

      if (existingOptionIndex > -1) {
        // If the filter option already exists, update it by appending the new value
        const existingOption = this.filterOptions[existingOptionIndex];
        const existingValues = existingOption.split('=')[1].split(',,,');
        const valueIndex = existingValues.indexOf(value);

        if (valueIndex === -1) {
          // Add the value to the filter option if it's not already present
          existingValues.push(value);
        } else {
          // Remove the value from the filter option if it's already present
          existingValues.splice(valueIndex, 1);
        }

        // Update the filter option in the array
        if (existingValues.length === 0) {
          this.filterOptions.splice(existingOptionIndex, 1);
        } else {
          this.filterOptions[
            existingOptionIndex
          ] = `${filter_type}=${existingValues.join(',,,')}`;
        }
      } else {
        // If the filter option doesn't exist, add it as a new option with the value
        this.filterOptions.push(`${filter_type}=${value}`);
      }
    }

    this.ProductSellerService.getProductSellerData(
      this.seller_business_name,
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
  isCategorySelected(category: string): boolean {
    const existingOptionIndex = this.filterOptions.findIndex(option =>
      option.startsWith('filter_category=')
    );
    if (existingOptionIndex > -1) {
      const existingOption = this.filterOptions[existingOptionIndex];
      const existingValues = existingOption.split('=')[1].split(',,,');
      return existingValues.includes(category);
    }

    return false;
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
      this.ProductSellerService.getProductSellerData(
        this.seller_business_name,
        this.searchQuery,
        undefined,
        undefined,
        undefined,
        undefined
      ).subscribe(result => {
        this.searchResults$ = of(result.products);
        this.totalSearchCount$ = of(result.totalCount);
      });
    }
  }
  keyDownFunction(event: any) {
    if (event.code === 'Enter') {
      //search call
      this.onSearch();
    }
  }
  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    return imgList[0];
  }
  ngOnDestroy(): void {
    this.paramMapSubscription.unsubscribe();
  }

  goToProductPage(prod_id: number): void {
    // Create the navigation extras object with the search query as a parameter

    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };

    this.router.navigate(['products'], navigationextras);
  }

  onIonInfinite(ev: any) {
    setTimeout(() => {
      this.onPageChange(ev);
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 1000);
  }
}
