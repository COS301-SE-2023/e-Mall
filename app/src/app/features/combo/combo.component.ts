import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import { ICombo } from '@features/combo-state/models/combo.interface';
import { Observable, Subscription, of } from 'rxjs';
import { EmailValidator, FormControl, FormGroup } from '@angular/forms';
import { IProduct } from '@shared/models/product/product.interface';
import { ConsumerService } from '@shared/servicies/consumer/consumer.service';
import { ActivatedRoute } from '@angular/router';
import { ComboFacade } from '@features/combo-state/services/combo.facade';
import { ComboEditComponent } from './combo-edit/combo-edit.component';
import { ModalController } from '@ionic/angular';
//import { AuthFacade } from '@app/features/auth/services/auth.facade';
//import { IUser } from '@app/features/auth/models/user.interface';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.scss'],
})
export class ComboComponent implements OnInit, OnDestroy {
  products$!: Observable<IProduct[] | undefined>;
  bool = true;
  profile$!: Observable<ISellerProfile | IConsumerProfile | null>;
  email!: string;
  username!: string | undefined;
  paramMapSubscription: Subscription;
  combo_id: number;
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
    this.combo_id = -1;
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
      const id = params.get('combo_id');

      if (id) {
        this.combo_id = +id;
        this.combo$ = this.comboFacade.getOneCombo(this.combo_id);
      }
    });

    this.combo$.subscribe(data => {
      this.products$ = of(data?.products);
      this.active_users = data?.active_emails;
      this.pending_users = data?.pending_users;
      this.name = data?.name;
    });
  }
  // Subscribe to route parameter changes and reload data accordingly

  ngAfterViewInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      // If needed, you can call the method to reload consumer products here
    });
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

  edit() {
    this.openComboPopover();
  }

  async openComboPopover() {
    const modal = await this.modalController.create({
      component: ComboEditComponent,
      componentProps: {
        combo_id: this.combo_id,
        combo_name: this.name, // Pass the product as a property
      },
    });
    return await modal.present();
  }

  leaveCombo() {
    const data = {
      combo_id: this.combo_id,
    };
    this.comboFacade.deleteUser(data);
    this.router.navigate(['/my-combos']);
  }
}
