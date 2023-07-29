import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { IProduct } from '@shared/models/product/product.interface';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';

@Component({
  selector: 'app-product-card',
  templateUrl: 'product-card.component.html',
  styleUrls: ['product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() product: any;
  isHearted = of(false);
  consumer_id!: string;
  constructor(
    private router: Router,
    private profileFacade: ProfileFacade,
    private analytics: AnalyticsService
  ) {}
  ngOnInit(): void {
    this.isHearted = this.profileFacade.checkWishlist(this.product.id);
    this.profileFacade.getProfile().subscribe(profile => {
      if (profile) {
        this.consumer_id = profile.id;
      }
    });
  }
  toggleHeart() {
    this.favClickAnalytics();
    this.profileFacade.toggleWishlist(this.product.id);
  }

  goToProductPage(prod_id: number): void {
    // Create the navigation extras object with the search query as a parameter

    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };

    this.router.navigate(['products'], navigationextras);

    console.log(prod_id);
  }
  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    return imgList[0];
  }
  favClickAnalytics(): void {
    if (this.product) {
      const data = {
        seller: this.product.min_price_seller_business_name,
        product: this.product.name,
        product_category: this.product.category,
        consumer_id: this.consumer_id,
        event_type: 'favourited_product',
        metadata: null,
      };
      console.log(data);
      console.log(this.product);
      this.analytics.createAnalyticsData(data);
    }
  }
}
