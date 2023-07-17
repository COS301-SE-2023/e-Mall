/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { Observable, of, Subscription } from 'rxjs';

import { FormControl } from '@angular/forms';
import { IProduct } from '@shared/models/product/product.interface';
import { ProductService } from '@shared/servicies/product/product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  prod_id: number;
  consumer_id!: string;
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
    private analytics: AnalyticsService
  ) {
    this.selected = new FormControl('default');
    this.paramMapSubscription = new Subscription();
    this.prod_id = -1;
  }
  ngOnInit(): void {
    this.paramMapSubscription = this.route.queryParamMap.subscribe(params => {
      this.selectedImage = '';
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
    this.consumer_id = 'c7c700c9-a5b4-4600-bd8d-a24bd355bd46';
    if (this.product$) {
      this.product$.subscribe(product => {
        this.product_name = product.name;
        this.product_category = product.category;

        if (this.sellers$) {
          this.sellers$.subscribe(sellers => {
            if (sellers.length > 0) {
              this.seller_name = sellers[0].business_name;

              const data = {
                seller: this.seller_name,
                product: this.product_name,
                product_category: this.product_category,
                consumer_id: this.consumer_id,
                event_type: 'product_click',
                metadata: null,
              };

              this.analytics.createAnalyticsData(data);
            }
          });
        }
      });
    }
  }

  linkClickAnalytics(seller_name: string | undefined): void {
    this.consumer_id = 'c7c700c9-a5b4-4600-bd8d-a24bd355bd46';
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
}
