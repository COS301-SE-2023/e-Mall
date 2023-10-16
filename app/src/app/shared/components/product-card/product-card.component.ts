/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { ModalController } from '@ionic/angular';
import { ComboPopoverComponent } from './combo-popover/combo-popover.component';
import { ComboFacade } from '@features/combo-state/services/combo.facade';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { WishlistFacade } from '@app/features/wishlist/wishlist-state/services/wishlist.facade';
import { ProductCardFacade } from './services/product-card.facade';
@Component({
  selector: 'app-product-card',
  templateUrl: 'product-card.component.html',
  styleUrls: ['product-card.component.scss'],
})
export class ProductCardComponent implements OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() product: any;
  @Input() pageType: string;
  @Input() collection_id!: any;
  isHearted = of(false);
  isBookmark = of(false);
  consumer_id!: string;
  consumer_email!: string;
  public isLoaded = false;
  public isFailed = false;
  selectedImg = 'assets/images/default.png';
  profileSubs = new Subscription();
  constructor(
    private modalController: ModalController,
    private router: Router,
    private profileFacade: ProfileFacade,
    private analytics: AnalyticsService,
    private comboFacade: ComboFacade,
    private authFacade: AuthFacade,
    private wishlistFacade: WishlistFacade,
    public productCardFacade: ProductCardFacade
  ) {
    this.pageType = '';
  }
  ngOnDestroy(): void {
    this.profileSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoaded = false;
    this.profileSubs = this.profileFacade.getProfile().subscribe(profile => {
      if (profile) {
        this.consumer_id = profile.id;
        this.consumer_email = profile.email;
      }
    });
  }
  onImageLoad() {
    this.isLoaded = true;
  }
  toggleHeart() {
    this.favClickAnalytics();
    this.profileFacade.toggleWishlist(this.product.id);
  }

  async toggleBookmark() {
    if (!(await this.authFacade.isLoggedIn())) {
      return this.router.navigate(['sign-in']);
    } else if ((await this.authFacade.getUserType()) === 'seller') {
      return this.router.navigate(['sales']);
    } else {
      this.isBookmark = of(true);
      return this.openComboPopover();
    }
  }

  async openComboPopover() {
    const modal = await this.modalController.create({
      component: ComboPopoverComponent,
      componentProps: {
        product: this.product,
      },
      cssClass: ['inventory-modal'],
      backdropDismiss: false,
      animated: true,
      mode: 'md',
      presentingElement: await this.modalController.getTop(),
    });
    return await modal.present();
  }
  updateWishlist() {
    this.favClickAnalytics();
    this.wishlistFacade.addProductToWishlist(this.product);
  }

  removeProd() {
    const data = {
      collection_id: this.collection_id,
      product_id: this.product.id,
    };
    this.comboFacade.removeProduct(data);
  }

  removeProdFromWishlist() {
    this.favClickAnalytics();
    this.wishlistFacade.removeProductFromWishlist(this.product);
  }

  goToProductPage(prod_id: number): void {
    // Create the navigation extras object with the search query as a parameter

    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };

    this.router.navigate(['products'], navigationextras);
  }
  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1) {
      this.selectedImg = 'assets/images/default.png';
    } else {
      this.selectedImg = imgList[0];
    }
    return this.selectedImg;
  }
  onImageFail() {
    this.isFailed = true;
    this.selectedImg = 'assets/images/default.png';
  }

  favClickAnalytics(): void {
    if (this.product) {
      const data = {
        seller: this.product.min_price_seller_business_name,
        product: this.product.name,
        product_category: this.product.category,
        consumer_email: this.consumer_email,
        event_type: 'favourited_product',
        metadata: null,
      };
      this.analytics.createAnalyticsData(data);
    }
  }
}
