import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import { ICombo } from '@features/combo-state/models/combo.interface';
import { ComboFacade } from '@features/combo-state/services/combo.facade';
import { Observable, Subscription, of } from 'rxjs';
import { EmailValidator, FormControl, FormGroup } from '@angular/forms';
import { IProduct } from '@shared/models/product/product.interface';
import { ConsumerService } from '@shared/servicies/consumer/consumer.service';
import { ActivatedRoute } from '@angular/router';
//import { AuthFacade } from '@app/features/auth/services/auth.facade';
//import { IUser } from '@app/features/auth/models/user.interface';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-combos',
  templateUrl: './my-combos.component.html',
  styleUrls: ['./my-combos.component.scss'],
})
export class MyCombosComponent implements OnInit, OnDestroy {
  products$!: Observable<IProduct[] | null>;
  combos$!: Observable<ICombo[] | null>;
  comboData: { id: number, name: string, images: string[] }[] = [];
  bool = true;
  //isAuthenticated: Observable<IUser | null>;
  profile$!: Observable<ISellerProfile | IConsumerProfile | null>;
  email!: string;
  private routeSubscription: Subscription = new Subscription();
  imgs: string[]=[];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public profileFacade: ProfileFacade,
    public comboFacade: ComboFacade,
    private consumerService: ConsumerService
  ) {}

  /*constructor(
    private router: Router,
    /*private authFacade: AuthFacade) {
      //this.isAuthenticated = this.authFacade.getCurrentUser();
     }*/

  ngOnInit(): void {
    this.profile$ = this.profileFacade.getProfile();
    this.profile$.subscribe(profile => {
      if (profile) {
        this.email = profile.email;
        this.loadcombos();
      }
    });
    this.collage();
  }
  // Subscribe to route parameter changes and reload data accordingly

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
    // Unsubscribe from the route parameter subscription to avoid memory leaks
    this.routeSubscription.unsubscribe();
  }
  loadcombos() {
    this.comboFacade.getCombos().subscribe(data => {
      if (data) this.combos$ = of(data);
    });

    this.combos$.subscribe(data => {
      console.log(data);
    });

  }
  goToCustomerProfile() {
    this.router.navigate(['/customer-profile']);
  }

  goToConstruction() {
    this.router.navigate(['/construction']);
  }
  goToComboPage(combo_id:number) {
   const navigationextras: NavigationExtras={
    queryParams:{combo_id:combo_id}
   }
    this.router.navigate(['/combo'],navigationextras);
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


  collage() {
    this.combos$.subscribe((combos) => {
      if (combos) {
        combos.forEach((combo:  ICombo) => {
          console.log(combo)
          if (combo.products) {
            // Create an object to store combo data
            this.imgs=[];
            let image_count = 0; // Counter to keep track of the number of images pushed for each combo
            combo.products.forEach((product: IProduct) => {
              if (product.min_price_img_array && image_count < 4) {
                console.log(product.min_price_img_array[0]);
                this.imgs.push(product.min_price_img_array[0]);
                image_count++;
              }
            });
            const comboObj = { id: combo.id, name: combo.name, images:this.imgs }; 
            this.comboData.push(comboObj); // Push the combo data object to the array
          }
        });
      }
      console.log("Combo Data", this.comboData);
    });
  }
  


}
