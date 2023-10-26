/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import { Observable, Subscription, map, of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { IProduct } from '@shared/models/product/product.interface';
import { ConsumerService } from '@shared/servicies/consumer/consumer.service';
import { ComboFacade } from '@features/combo-state/services/combo.facade';
import { ICombo } from '@features/combo-state/models/combo.interface';
import { WishlistFacade } from './wishlist-state/services/wishlist.facade';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  products$!: Observable<IProduct[] | null>;
  comboData$: Observable<any> | undefined;
  bool = true;
  //isAuthenticated: Observable<IUser | null>;
  customerprofileForm: FormGroup;
  profile$!: Observable<ISellerProfile | IConsumerProfile | null>;
  email!: string;
  private routeSubscription: Subscription = new Subscription();
  showSpinner = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public profileFacade: ProfileFacade,
    private consumerService: ConsumerService,
    private comboFacade: ComboFacade,
    private wishlistFacade: WishlistFacade
  ) {
    this.customerprofileForm = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      details: new FormControl(),
    });
  }

  /*constructor(
    private router: Router,
    /*private authFacade: AuthFacade) {
      //this.isAuthenticated = this.authFacade.getCurrentUser();
     }*/

  ngOnInit(): void {
    this.showSpinner = true;

    setTimeout(() => {
      this.showSpinner = false;
    }, 1000);

    this.profile$ = this.profileFacade.getProfile();
    this.profile$.subscribe(profile => {
      if (profile) {
        this.email = profile.email;
        this.loadWishlist();
      }
    });
    this.comboData();
  }
  // Subscribe to route parameter changes and reload data accordingly

  ngOnDestroy(): void {
    // Unsubscribe from the route parameter subscription to avoid memory leaks
    this.routeSubscription.unsubscribe();
  }
  loadWishlist() {
    this.wishlistFacade.getWishlist().subscribe(data => {
      if (data) {
        this.products$ = of(data);
      }
    });
  }
  goToCustomerProfile() {
    this.router.navigate(['/customer-profile']);
  }
  goToComboPage(combo_id: number) {
    const navigationextras: NavigationExtras = {
      queryParams: { combo_id: combo_id },
    };
    this.router.navigate(['/combo'], navigationextras);
  }

  goToConstruction() {
    this.router.navigate(['/construction']);
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

    this.router.navigate(['products'], navigationextras);
  }

  comboData() {
    this.comboData$ = this.comboFacade.getCombos().pipe(
      map(combos => {
        if (combos) {
          const comboData: any[] = [];
          combos.forEach((combo: ICombo) => {
            if (combo.products) {
              const comboObj = {
                id: combo.id,
                name: combo.name,
              };
              comboData.push(comboObj);
            }
          });
          return comboData;
        } else {
          return [];
        }
      })
    );
  }
}
