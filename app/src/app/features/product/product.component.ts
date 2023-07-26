/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { Observable, of, Subscription } from 'rxjs';

import { FormControl } from '@angular/forms';
import { IProduct } from '@shared/models/product/product.interface';
import { ProductService } from '@shared/servicies/product/product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  prod_id: number;
  consumer_id!: string | null;
  product$: Observable<IProduct> | undefined;
  sellers$: Observable<IProductSeller[]> | undefined;
  currency$: Observable<string> | undefined;
  seller_name!: string | undefined;
  product_name!: string;
  product_category!: string;
  selectedImage!: string;

  currencyCode = 'ZAR';

  //expandedStates: Map<string, boolean> = new Map<string, boolean>();

  selected: FormControl;
  divClicked = false;
  private paramMapSubscription: Subscription;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private analytics: AnalyticsService,
    private profileFacade: ProfileFacade
  ) {
    this.selected = new FormControl('default');
    this.paramMapSubscription = new Subscription();
    this.prod_id = -1;
  }
  ngOnInit(): void {
    this.paramMapSubscription = this.route.queryParamMap.subscribe(params => {
      this.selectedImage = '';
      this.profileFacade.getProfile().subscribe(profile => {
        if (profile) {
          this.consumer_id = profile.id;
        }
      });
      if (this.consumer_id === undefined) {
        this.consumer_id = null;
      }
      // this.consumer_id = this.profileFacade.getProfile().id;
      const id = params.get('prod_id');
      if (id) {
        this.prod_id = +id;
        this.product$ = this.productService.getProductData(this.prod_id);
        this.sellers$ = this.productService.getSellerList(
          this.prod_id,
          'default'
        );
        this.currency$ = of('ZAR');
      }
    });
    this.prodClickAnalytics();
  }

  prodClickAnalytics(): void {
    if (this.product$) {
      this.product$.subscribe(product => {
        this.product_name = product.name;
        this.product_category = product.category;

        if (this.sellers$) {
          this.sellers$.subscribe(sellers => {
            console.log(sellers);
            if (sellers.length > 0) {
              sellers.forEach(currentseller => {
                const data = {
                  seller: currentseller.business_name,
                  product: this.product_name,
                  product_category: this.product_category,
                  consumer_id: this.consumer_id,
                  event_type: 'product_click',
                  metadata: null,
                };

                this.analytics.createAnalyticsData(data);
              });
            }
          });
        }
      });
    }
  }

  linkClickAnalytics(seller_name: string | undefined): void {
    if (this.product$) {
      this.product$.subscribe(product => {
        this.product_name = product.name;
        this.product_category = product.category;

        const data = {
          seller: seller_name,
          product: this.product_name,
          product_category: this.product_category,
          consumer_id: this.consumer_id,
          event_type: 'link_click',
          metadata: null,
        };
        this.analytics.createAnalyticsData(data);
      });
    }
  }
  ngOnDestroy(): void {
    this.paramMapSubscription.unsubscribe();
  }

  /*
  togglePanel(seller: any) {
    const expanded = this.expandedStates.get(seller.id) || false;
    this.expandedStates.set(seller.id, !expanded);
  }
  
  isExpanded(seller: any): boolean {
    return this.expandedStates.get(seller.id) || false;
  }
  
  getAriaLabel(seller: any): string {
    return this.isExpanded(seller) ? 'Collapse panel' : 'Expand panel';
  }*/

  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList) {
      return '';
    }

    return imgList[0];
  }
  scroll(el: HTMLElement) {
    const navbareight = 50; // Replace with the actual height of your navbar
    const y = el.getBoundingClientRect().top + window.scrollY - navbareight;
    window.scrollTo({ top: y });
    // el.scrollIntoView();
  }
  onlyInStockToggler() {
    this.divClicked = !this.divClicked;

    this.sellers$ = this.productService.getSellerList(
      this.prod_id,
      this.divClicked.toString()
    );
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }
  followed_seller(seller: string, checked: boolean) {
    this.profileFacade.getProfile().subscribe(profile => {
      if (profile) {
        if (checked) {
          //TODO: check if seller is already in the list
          //const index =
          if (profile.details.followed_sellers.indexOf(seller) === -1) {
            profile.details.followed_sellers.push(seller);
          }
        }
        if (!checked) {
          profile.details.followed_sellers.splice(
            profile.details.followed_sellers.indexOf(seller)
          );
        }
        console.log(profile.details.followed_sellers);

        this.profileFacade.updateProfile(profile);
      }
    });
  }
  favourited_product(prod_id: number, checked: boolean) {
    this.profileFacade.getProfile().subscribe(profile => {
      if (profile) {
        if (checked) {
          if (profile.details.wishlist.indexOf(prod_id) === -1) {
            profile.details.wishlist.push(prod_id);
          }
        }
        if (!checked) {
          if (profile.details.wishlist.indexOf(prod_id) !== -1) {
            profile.details.wishlist.splice(
              profile.details.wishlist.indexOf(prod_id)
            );
          }
        }
        console.log(profile.details.wishlist);
        this.favClickAnalytics();
        this.profileFacade.updateProfile(profile);
      }
    });
  }
  favClickAnalytics(): void {
    if (this.product$) {
      this.product$.subscribe(product => {
        this.product_name = product.name;
        this.product_category = product.category;

        if (this.sellers$) {
          this.sellers$.subscribe(sellers => {
            console.log(sellers);
            if (sellers.length > 0) {
              sellers.forEach(currentseller => {
                const data = {
                  seller: currentseller.business_name,
                  product: this.product_name,
                  product_category: this.product_category,
                  consumer_id: this.consumer_id,
                  event_type: 'favourited_product',
                  metadata: null,
                };

                this.analytics.createAnalyticsData(data);
              });
            }
          });
        }
      });
    }
  }
  goToSellerPage(seller_id: string): void {
    // Create the navigation extras object with the search query as a parameter
    const navigationextras: NavigationExtras = {
      queryParams: { seller_id: seller_id },
    };
    console.log(navigationextras);
    this.router.navigate(['seller-details'], navigationextras);
  }
}
