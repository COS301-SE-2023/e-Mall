/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ProductSellerService } from '@shared/servicies/productseller/productseller.service';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { ProductService } from '@shared/servicies/product/product.service';
import { PopoverController } from '@ionic/angular';
import { PopovereditComponent } from '../popoveredit/popoveredit.component';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { ISeller } from '@shared/models/seller/seller.interface';
import { SellerService } from '@shared/servicies/seller/seller.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { SellerDataResolver } from './seller-details-resolver';
@Component({
  selector: 'app-inventory',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.scss'],
})
export class SellerDetailsComponent implements OnInit {
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
  isChecked!: boolean;
  currentPage!: number;
  itemsPerPage!: number;
  totalSearchCount$: Observable<number> | undefined;

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

          // Fetch the profile data and return the observable
          return this.profileFacade.getProfile();
        }),
        // Use take(1) to ensure the observable completes after the first emission
        take(1),
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

          this.updateButtonState();
        })
      )
      .subscribe(data => {
        if (data?.details.followed_sellers) {
          this.is_followed = data.details.followed_sellers.includes(
            this.seller_business_name
          );
        }

        console.log(this.seller_business_name);
        console.log(this.is_followed);
        this.searchResults$?.subscribe(data => {
          console.log(data);
        });
      });
  }

  updateButtonState() {
    if (this.is_followed == true) {
      this.buttonText = 'Unfollow';
    } else {
      this.buttonText = 'Follow';
    }
  }

  followed_seller(seller: string) {
    console.log(seller);
    console.log(this.is_followed);
    this.profileFacade.getProfile().subscribe(profile => {
      if (profile) {
        if (this.is_followed == false) {
          //TODO: check if seller is already in the list
          this.is_followed = true;
          this.updateButtonState();
          if (profile.details.followed_sellers.indexOf(seller) === -1) {
            profile.details.followed_sellers.push(seller);
          }
        } else if (this.is_followed == true) {
          this.is_followed = false;
          this.updateButtonState();
          const index = profile.details.followed_sellers.indexOf(seller);
          if (index !== -1) {
            profile.details.followed_sellers.splice(index, 1);
          }
        }
        this.profileFacade.updateProfile(profile);
      }
    });
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
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
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
    this.searchResults$?.subscribe().unsubscribe();
  }
}
