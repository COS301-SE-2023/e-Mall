/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ProductSellerService } from '@shared/servicies/productseller/productseller.service';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { ProductService } from '@shared/servicies/product/product.service';
import { PopoverController } from '@ionic/angular';
import { PopovereditComponent } from '../popoveredit/popoveredit.component';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { ISeller } from '@shared/models/seller/seller.interface';
import { SellerService } from '@shared/servicies/seller/seller.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.scss'],
})
export class SellerDetailsComponent {
  buttonText = 'Follow';
  seller$: Observable<ISeller> = of();
  seller_business_name?: string;
  seller_id?: string | null;
  is_followed?: boolean;

  private paramMapSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private ProductSellerService: ProductSellerService,
    private popoverController: PopoverController,
    private profileFacade: ProfileFacade,
    private sellerService: SellerService
  ) {
    this.paramMapSubscription = new Subscription();
    this.seller_id = '';
  }

  ngOnInit(): void {
    this.paramMapSubscription = this.route.queryParamMap.subscribe(params => {
      this.seller_id = params.get('seller_id');
      if (this.seller_id) {
        const data = {
          seller_id: this.seller_id,
        };
        this.sellerService.getSellerData(data).subscribe((res: ISeller) => {
          this.seller$ = of(res);
          this.seller$.subscribe(data => {
            this.seller_business_name = data.business_name;
          });
        });
      }
    });
    this.profileFacade.getProfile().subscribe(data => {
      if (data?.details.followed_sellers) {
        this.is_followed = data.details.followed_sellers.includes(
          this.seller_business_name
        );
      }
      console.log(this.is_followed);
      this.updateButtonState();
    });
  }

  updateButtonState() {
    if (this.is_followed == true) {
      this.buttonText = 'Unfollow';
    } else {
      this.buttonText = 'Follow';
    }
  }

  followed_seller(seller: string) {
    console.log(seller);
    console.log(this.is_followed);
    this.profileFacade.getProfile().subscribe(profile => {
      if (profile) {
        if (this.is_followed == false) {
          //TODO: check if seller is already in the list
          this.is_followed = true;
          this.updateButtonState();
          if (profile.details.followed_sellers.indexOf(seller) === -1) {
            profile.details.followed_sellers.push(seller);
          }
        } else if (this.is_followed == true) {
          this.is_followed = false;
          this.updateButtonState();
          const index = profile.details.followed_sellers.indexOf(seller);
          if (index !== -1) {
            profile.details.followed_sellers.splice(index, 1);
          }
        }
        this.profileFacade.updateProfile(profile);
      }
    });
  }
}
