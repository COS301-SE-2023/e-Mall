/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewChecked,
  AfterViewInit,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ProductService } from '@shared/servicies/product/product.service';
import { IProduct } from '@shared/models/product/product.interface';
import { Observable, Subscription, of } from 'rxjs';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { ProductCardFacade } from '@app/shared/components/product-card/services/product-card.facade';
import { AuthFacade } from '../auth/services/auth.facade';

//import { register } from 'swiper/element/bundle';
//register();
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

  // showSpinner = true;
  cat_pages = [
    { title: 'ELECTRONICS', path: '/category/Electronics' },
    { title: 'SPORTS & OUTDOORS', path: '/category/Sports%20and%20Outdoors' },
    { title: 'CLOTHING', path: '/category/Clothing', nav: '' },
    { title: 'HOME & KITCHEN', path: '/category/Home%20and%20Kitchen' },
    { title: 'HEALTH & BEAUTY', path: '/category/Health%20and%20Beauty' },
    { title: 'TOYS & GAMES', path: '/category/Toys%20and%20Games' },
    { title: 'BOOKS', path: '/category/Books' },
  ];
  // isAuthenticated$;
  constructor(
    private router: Router,
    private productService: ProductService,
    public profileFacade: ProfileFacade,
    public productCardFacade: ProductCardFacade,
    public authFacade: AuthFacade
  ) {
    this.followedSellers$ = of(null);
    this.forYouProducts$ = of(null);
    this.followSubs = this.profileFacade.followedSellers$.subscribe(val => {
      if ((val !== null || val !== undefined) && val.length > 0) {
        this.followedSellers$ = this.profileFacade.fetchFollowedSellerDetails();
      }
    });
    this.forYouSubs = this.profileFacade.recommendedProducts$.subscribe(val => {
      if ((val !== null || val !== undefined) && val.length > 0) {
        this.forYouProducts$ = of(val);
      }
    });
  }
  async ionViewWillEnter() {
    this.profileFacade.fetchRecommendedProducts();
  }

  ngOnInit(): void {
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
    // this.trendingProducts$.subscribe(val => console.log(val));
    // .pipe(delay(3000));
    // this.trendingProducts$ = this.productService.getTrendingProducts();
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
