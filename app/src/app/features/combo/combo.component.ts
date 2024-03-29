/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import { ICombo } from '@features/combo-state/models/combo.interface';
import { Observable, Subscription, map, of } from 'rxjs';
import { IProduct } from '@shared/models/product/product.interface';
import { ConsumerService } from '@shared/servicies/consumer/consumer.service';
import { ComboFacade } from '@features/combo-state/services/combo.facade';
import { ComboEditComponent } from './combo-edit/combo-edit.component';
import { ModalController } from '@ionic/angular';
import { ComboInviteComponent } from './combo-invite/combo-invite.component';
//import { AuthFacade } from '@app/features/auth/services/auth.facade';
//import { IUser } from '@app/features/auth/models/user.interface';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.scss'],
})
export class ComboComponent implements OnInit, OnDestroy {
  comboData$: Observable<any> | undefined;
  products$!: Observable<IProduct[] | undefined>;
  bool = true;
  profile$!: Observable<ISellerProfile | IConsumerProfile | null>;
  email!: string;
  username!: string | undefined;
  paramMapSubscription: Subscription;
  collection_id: number;
  combo$!: Observable<ICombo | null | undefined>;
  name: string | undefined;
  active_users: string[] | undefined = [];
  pending_users: string[] | undefined = [];
  isPanelOpen: { [key: number]: boolean } = {};
  private routeSubscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public profileFacade: ProfileFacade,
    private consumerService: ConsumerService,
    private comboFacade: ComboFacade,
    private modalController: ModalController
  ) {
    this.paramMapSubscription = new Subscription();
    this.collection_id = -1;
  }

  ngOnInit(): void {
    this.profile$ = this.profileFacade.getProfile();
    this.profile$.subscribe(profile => {
      if (profile) {
        this.email = profile.email;
        this.username = profile.username;
      }
    });
    this.paramMapSubscription = this.route.queryParamMap.subscribe(params => {
      const id = params.get('collection_id');
      if (id) {
        this.collection_id = +id;
        this.fetchComboData(this.collection_id);
      }
    });
  }
  // Subscribe to route parameter changes and reload data accordingly

  fetchComboData(ComboID: number): void {
    this.combo$ = this.comboFacade.getOneCombo(ComboID);
    this.combo$.subscribe(data => {
      this.products$ = of(data?.products);
      this.active_users = data?.active_emails;
      this.pending_users = data?.pending_users;
      this.name = data?.name;
    });
    this.comboData();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the route parameter subscription to avoid memory leaks
    this.routeSubscription.unsubscribe();
    this.combo$ = null as any;
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

  goToComboPage(collection_id: number) {
    const navigationextras: NavigationExtras = {
      queryParams: { collection_id: collection_id },
    };
    this.router.navigate(['/collection'], navigationextras);
  }

  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    return imgList[0];
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  goToProductPage(prod_id: number): void {
    // Create the navigation extras object with the search query as a parameter

    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };

    this.router.navigate(['products'], navigationextras);
  }

  edit() {
    this.openComboEditPopover();
  }
  invite() {
    this.openComboInvitePopover();
  }
  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'exit-button',
    },
    {
      text: 'Confirm',
      role: 'confirm',
      cssClass: 'cancel-button',
      handler: () => {
        this.leaveCombo();
      },
    },
  ];
  async openComboEditPopover() {
    const modal = await this.modalController.create({
      component: ComboEditComponent,
      componentProps: {
        collection_id: this.collection_id,
        combo_name: this.name,
      },
      cssClass: ['inventory-modal'],
      backdropDismiss: false,
      animated: true,
      mode: 'md',
      presentingElement: await this.modalController.getTop(),
    });
    return await modal.present();
  }

  async openComboInvitePopover() {
    const modal = await this.modalController.create({
      component: ComboInviteComponent,
      componentProps: {
        collection_id: this.collection_id,
      },
      cssClass: ['inventory-modal'],
      backdropDismiss: false,
      animated: true,
      mode: 'md',
      presentingElement: await this.modalController.getTop(),
    });
    return await modal.present();
  }

  leaveCombo() {
    const data = {
      collection_id: this.collection_id,
    };
    this.comboFacade.deleteUser(data);
    this.router.navigate(['/my-collections']);
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
