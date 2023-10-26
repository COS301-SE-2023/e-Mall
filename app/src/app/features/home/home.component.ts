/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ProductService } from '@shared/servicies/product/product.service';
import { IProduct } from '@shared/models/product/product.interface';
import { Observable, Subscription, debounceTime, of, share } from 'rxjs';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { ProductCardFacade } from '@app/shared/components/product-card/services/product-card.facade';
import { AuthFacade } from '../auth/services/auth.facade';

import { register, SwiperContainer } from 'swiper/element/bundle';
import Swiper from 'swiper';
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  popProducts$: Observable<IProduct[]> | undefined;
  forYouProducts$: Observable<IProduct[]> | Observable<any> | undefined;
  tempProducts$: Observable<IProduct[]> | undefined;
  trendingProducts$: Observable<IProduct[]> | undefined;
  followedSellers$: Observable<any> | undefined;
  followSubs = new Subscription();
  forYouSubs = new Subscription();
  imageObject: Array<object> = [];
  images = 'assets/images/home_banner.png';
  @ViewChild('recommendedHeading') recommendedHeading!: ElementRef;
  isLoggedIn = false;
  authSubscription = new Subscription();

  // showSpinner = true;
  cat_pages = [
    {
      title: 'BOOKS',
      path: '/category/Books',
      img: 'assets/images/categories/books.png',
    },
    {
      title: 'CLOTHING',
      path: '/category/Clothing',
      img: 'assets/images/categories/clothing.png',
    },
    {
      title: 'ELECTRONICS',
      path: '/category/Electronics',
      img: 'assets/images/categories/electronics.png',
    },
    {
      title: 'FOOD',
      path: '/category/Food',
      img: 'assets/images/categories/food.jpg',
    },
    {
      title: 'HOME & KITCHEN',
      path: '/category/Home%20and%20Kitchen',
      img: 'assets/images/categories/kitchen.png',
    },
    {
      title: 'HEALTH & BEAUTY',
      path: '/category/Health%20and%20Beauty',
      img: 'assets/images/categories/beauty.png',
    },
    {
      title: 'SPORTS & OUTDOORS',
      path: '/category/Sports%20and%20Outdoors',
      img: 'assets/images/categories/sports.png',
    },
    {
      title: 'TOYS & GAMES',
      path: '/category/Toys%20and%20Games',
      img: 'assets/images/categories/toys.png',
    },
  ];
  // isAuthenticated$;
  constructor(
    private router: Router,
    private productService: ProductService,
    public profileFacade: ProfileFacade,
    public productCardFacade: ProductCardFacade,
    public authFacade: AuthFacade,
    private changeDetector: ChangeDetectorRef
  ) {
    this.followedSellers$ = this.profileFacade.followedSellersDetails$;
    this.followedSellers$.pipe(debounceTime(500)).subscribe(data => {
      if (data.length > 0) {
        setTimeout(() => {
          const swiperEl: SwiperContainer | null =
            document.querySelector('swiper-container');
          swiperEl?.swiper.update();
        }, 1000);
        // this.swiperr.update();
      }
    });
    this.forYouProducts$ = of(null);
    // this.followSubs = this.profileFacade.followedSellers$.subscribe(val => {
    //   if ((val !== null || val !== undefined) && val.length > 0) {
    //     this.followedSellers$ = this.profileFacade.fetchFollowedSellerDetails();
    //   }
    // });
    this.forYouSubs = this.profileFacade.recommendedProducts$.subscribe(val => {
      if ((val !== null || val !== undefined) && val.length > 0) {
        this.forYouProducts$ = of(val);
      }
    });
    this.authSubscription = this.authFacade
      .getCurrentUser()
      .pipe(debounceTime(500), share())
      .subscribe(async user => {
        if (user && user.type === 'consumer') {
          // console.log(user);
          await this.fetchFollowedSellerDetails();
        }
      });
  }

  async ionViewWillEnter() {
    this.profileFacade.fetchRecommendedProducts();
  }

  async fetchFollowedSellerDetails() {
    await this.profileFacade.fetchFollowedSellerDetails();
  }
  async ngOnInit(): Promise<void> {
    // this.showSpinner = true;

    // setTimeout(() => {
    //   this.showSpinner = false;

    // }, 6000);
    this.fetchPopProducts();
    this.fetchTrendingProducts();

    // this.profileFacade.fetchRecommendedProducts();

    // this.showSpinner = false;
  }
  async onCatClicked(path: string) {
    this.router.navigate([path]);
  }
  fetchPopProducts() {
    //Need to implement AI algo
    //Mock data below
    this.popProducts$ = this.productService.getPopProducts();
  }

  fetchTrendingProducts() {
    this.trendingProducts$ = this.productService.getTrendingProducts();
  }

  search(searchQuery: string): void {
    // Create the navigation extras object with the search query as a parameter
    const navigationextras: NavigationExtras = {
      queryParams: { search: searchQuery },
    };

    this.router.navigate(['/search-results'], navigationextras);
  }

  goToProductPage(prod_id: number): void {
    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };
    this.router.navigate(['products'], navigationextras);
  }

  async onAboutClick() {
    this.router.navigate(['about']);
  }

  onRegClick() {
    this.router.navigate(['register']);
  }

  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1) return 'assets/images/default.png';

    return imgList[0];
  }
  redirect(seller_id: string): void {
    const navigationextras: NavigationExtras = {
      queryParams: { seller_id: seller_id },
    };
    this.router.navigate(['seller-details'], navigationextras);
  }
  ngOnDestroy(): void {
    this.followSubs.unsubscribe();
    this.forYouSubs.unsubscribe();
  }
}
