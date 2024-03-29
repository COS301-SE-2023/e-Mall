/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { Observable, of, Subscription } from 'rxjs';

import { FormControl } from '@angular/forms';
import { IProduct } from '@shared/models/product/product.interface';
import { ProductService } from '@shared/servicies/product/product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ComboPopoverComponent } from '@shared/components/product-card/combo-popover/combo-popover.component';
import { PageLoaderFacade } from '@app/shared/components/loader/loader-for-page.facade';
import { AuthFacade } from '../auth/services/auth.facade';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export default class ProductComponent implements OnInit, OnDestroy {
  prod_id: number;
  consumer_id!: string | null;
  consumer_email!: string | null;
  product$: Observable<IProduct> | undefined;
  sellers$: Observable<IProductSeller[]> | undefined;
  followed_sellers$: Observable<string[]> | undefined;
  currency$: Observable<string> | undefined;
  seller_name!: string | undefined;
  product_name!: string;
  product_category!: string;
  selectedImage: string | undefined;
  isHearted = of(false);
  product_params!: IProduct;
  applyCustomClass = true; // Set it to true on the specific page where you want the custom class.

  isBookmark = of(false);

  currencyCode = 'ZAR';

  main_image_loaded = false;

  // showSpinner = true;
  // showSpinner2 = true;

  // Your timer function

  //expandedStates: Map<string, boolean> = new Map<string, boolean>();

  selected: FormControl;
  divClicked = false;
  private paramMapSubscription: Subscription;
  constructor(
    private modalController: ModalController,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private analytics: AnalyticsService,
    private profileFacade: ProfileFacade,
    public loader: PageLoaderFacade,
    private authFacade: AuthFacade
  ) {
    this.selected = new FormControl('default');
    this.paramMapSubscription = new Subscription();
    this.prod_id = -1;
  }

  ngOnInit(): void {
    // this.showSpinner = true;
    // this.showSpinner2 = true;

    // setTimeout(() => {
    //   this.showSpinner = false;
    //   this.showSpinner2 = false;
    // }, 6500);

    this.paramMapSubscription = this.route.queryParamMap.subscribe(params => {
      this.selectedImage = undefined;
      this.profileFacade.getProfile().subscribe(profile => {
        if (profile) {
          this.consumer_id = profile.id;
          this.consumer_email = profile.email;
        }
      });
      if (this.consumer_id === undefined) {
        this.consumer_id = null;
      }
      if (this.consumer_email === undefined) {
        this.consumer_email = null;
      }
      // this.consumer_id = this.profileFacade.getProfile().id;
      const id = params.get('prod_id');

      if (id) {
        this.prod_id = +id;
        this.product$ = this.productService.getProductData(this.prod_id);
        this.product$.subscribe(data => {
          this.product_params = data;
        });
        this.sellers$ = this.productService.getSellerList(
          this.prod_id,
          'default'
        );
        this.currency$ = of('ZAR');

        this.isHearted = this.profileFacade.checkWishlist(this.prod_id);
      }
    });
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
        product: this.product_params,
        consumer_email: this.consumer_email,
      },
      cssClass: ['inventory-modal'],
      backdropDismiss: false,
      animated: true,
      mode: 'md',
      presentingElement: await this.modalController.getTop(),
    });
    return await modal.present();
  }
  async prodClickAnalytics(): Promise<void> {
    if (this.product$) {
      this.product$.subscribe(product => {
        this.product_name = product.name;
        this.product_category = product.category;

        if (this.sellers$) {
          this.sellers$.subscribe(sellers => {
            if (sellers.length > 0) {
              sellers.forEach(currentseller => {
                const data = {
                  seller: currentseller.business_name,
                  product: this.product_name,
                  product_category: this.product_category,
                  consumer_email: this.consumer_email,
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
          consumer_email: this.consumer_email,
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

  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList) {
      return 'assets/images/default.png';
    }

    return imgList[0];
  }
  onImageFail() {
    this.selectImage('assets/images/default.png');
  }
  scroll(el: HTMLElement) {
    const navbareight = 50; // Replace with the actual height of your navbar
    const y = el.getBoundingClientRect().top + window.scrollY - navbareight;
    window.scrollTo({ top: y });
    el.scrollIntoView();
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
  favClickAnalytics(): void {
    if (this.product$) {
      this.product$.subscribe(product => {
        this.product_name = product.name;
        this.product_category = product.category;

        if (this.sellers$) {
          this.sellers$.subscribe(sellers => {
            if (sellers.length > 0) {
              sellers.forEach(currentseller => {
                const data = {
                  seller: currentseller.business_name,
                  product: this.product_name,
                  product_category: this.product_category,
                  consumer_email: this.consumer_email,
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
    this.router.navigate(['seller-details'], navigationextras);
  }
  ionViewWillEnter() {
    this.loader.loading.next(true);
    this.prodClickAnalytics();
  }
  ionViewWillLeave() {
    this.loader.loading.next(false);
  }
  onImageLoad() {
    this.main_image_loaded = true;
  }
  onImageStart() {
    this.main_image_loaded = false;
  }
  updateUrl(event: any) {
    event.target.src = 'assets/images/default.png';
  }
}
