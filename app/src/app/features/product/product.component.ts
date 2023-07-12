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
    console.log('prod click');
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
              console.log(data);

              this.analytics.createAnalyticsData(data);
            }
          });
        }
      });
    }
  }

  linkClickAnalytics(seller_name: string): void {
    console.log('link click');
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
        console.log(data);
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

  getImgs(imgList?: string[]): string[] {
    //remove following when no need to have mock data
    if (!imgList || imgList.length <= 1)
      return [
        'data:image/jpeg;base64,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',
        'data:image/jpeg;base64,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',
      ];
    return imgList.slice(1, Math.min(imgList.length, 5));
  }
  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

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
}
