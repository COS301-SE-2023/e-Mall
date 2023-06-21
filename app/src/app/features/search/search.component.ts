import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@app/services/product/product.service';
import { IProduct } from '@app/models/product/product.interface';
import { Router, NavigationExtras } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable, map, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';
import { result } from 'cypress/types/lodash';
import { ChangeDetectorRef } from '@angular/core';

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
  selectedBrands: string[] = []; // Stores the selected brand options
  sellerOptions: string[] = []; // Populate this array with the seller names based on your search results
  selectedSellers: string[] = []; // Stores the selected seller options
  categoryElectronics!: boolean;
  categoryClothing!: boolean;
  categoryHomeAndKitchen!: boolean;
  categoryHealthAndBeauty!: boolean;
  categorySportsAndOutdoors!: boolean;
  categoryToysAndGames!: boolean;
  categoryBooks!: boolean;
  categoryFoodAndBeverages!: boolean;
  selectedSortOption!: string;
  currentPage$ = new BehaviorSubject<number>(0);
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
      this.productService
        .searchProducts(
          this.searchQuery,
          null,
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

    this.router.navigate(['products', prod_id], navigationextras);
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
        null,
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
}
