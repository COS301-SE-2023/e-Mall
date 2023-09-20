import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import {
  ICombo,
  ICombo_invites,
} from '@features/combo-state/models/combo.interface';
import { ComboFacade } from '@features/combo-state/services/combo.facade';
import { Observable, Subscription, map, of } from 'rxjs';
import { EmailValidator, FormControl, FormGroup } from '@angular/forms';
import { IProduct } from '@shared/models/product/product.interface';
import { ConsumerService } from '@shared/servicies/consumer/consumer.service';
import { ActivatedRoute } from '@angular/router';
import { WishlistFacade } from '../wishlist/wishlist-state/services/wishlist.facade';

@Component({
  selector: 'app-my-combos',
  templateUrl: './my-combos.component.html',
  styleUrls: ['./my-combos.component.scss'],
})
export class MyCombosComponent implements OnInit, OnDestroy {
  products$!: Observable<IProduct[] | null>;
  combos$!: Observable<ICombo[] | null>;
  comboData$: Observable<any> | undefined;
  bool = true;
  //isAuthenticated: Observable<IUser | null>;
  profile$!: Observable<ISellerProfile | IConsumerProfile | null>;
  email!: string;
  private routeSubscription: Subscription = new Subscription();
  imgs: string[] = [];
  wishlistImages: string[] = [];
  comboInvites$!: Observable<ICombo_invites[] | null>;
  isPanelOpen: { [key: number]: boolean } = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public profileFacade: ProfileFacade,
    public comboFacade: ComboFacade,
    private consumerService: ConsumerService,
    private wishlistFacade: WishlistFacade
  ) {}
  ngOnInit(): void {
    this.profile$ = this.profileFacade.getProfile();
    this.profile$.subscribe(profile => {
      if (profile) {
        this.email = profile.email;
      }
    });
    this.collage();
    this.wishlistCollage();
    this.invites();
  }

  ngAfterViewInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      // Check if the 'seller_id' query parameter exists in the route
      if (params['seller_id']) {
        // Perform any necessary actions here when 'seller_id' is present in the route
        // For example, you can fetch seller-specific data based on 'seller_id'
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
  togglePanel(panelNumber: number) {
    this.isPanelOpen[panelNumber] = !this.isPanelOpen[panelNumber];
  }

  goToCustomerProfile() {
    this.router.navigate(['/customer-profile']);
  }

  goToConstruction() {
    this.router.navigate(['/construction']);
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  goToComboPage(collection_id: number) {
    const navigationextras: NavigationExtras = {
      queryParams: { collection_id: collection_id },
    };
    this.router.navigate(['/collection'], navigationextras);
  }

  goToProductPage(prod_id: number): void {
    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };

    this.router.navigate(['products'], navigationextras);
  }

  collage() {
    this.comboData$ = this.comboFacade.getCombos().pipe(
      map(combos => {
        if (combos) {
          const comboData: any[] = [];

          combos.forEach((combo: ICombo) => {
            if (combo.products) {
              this.imgs = [];

              for (let i = 0; i < 4; i++) {
                this.imgs[i] = 'assets/images/logo-black-no-bg.png';
              }
              let image_count = 0;
              combo.products.forEach((product: IProduct) => {
                if (product.min_price_img_array && image_count < 4) {
                  this.imgs[image_count] = product.min_price_img_array[0];
                  image_count++;
                }
              });
              const comboObj = {
                id: combo.id,
                name: combo.name,
                images: this.imgs,
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

  wishlistCollage() {
    //get from wishlist state
    this.wishlistFacade.getWishlist().subscribe(data => {
      for (let i = 0; i < 4; i++) {
        this.wishlistImages[i] = 'assets/images/logo-black-no-bg.png';
      }
      let image_count = 0;
      if (data)
        data.forEach((product: IProduct) => {
          if (product.min_price_img_array && image_count < 4) {
            this.wishlistImages[image_count] = product.min_price_img_array[0];
            image_count++;
          }
        });
    });
  }

  invites() {
    this.comboFacade.getCombos_invites().subscribe(data => {
      if (data) {
        this.comboInvites$ = of(data);
      }
    });
  }
  AcceptFunction(collection_id: number) {
    const data = {
      collection_id: collection_id,
      user_email: this.email,
      action: 'Accept',
    };
    this.comboFacade.updateUsers(data);
    window.location.reload();
  }
  RejectFunction(collection_id: number) {
    const data = {
      collection_id: collection_id,
      user_email: this.email,
      action: 'Reject',
    };
    this.comboFacade.updateUsers(data);
    window.location.reload();
  }
}

// what frameworks am i familar with
// recent trends in software development
// what i use to keep up tp date software
// what main goal in software engineering an
