// dropdown-popover.component.ts

import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

//import { ProductSellerService } from '@shared/servicies/product-seller/product-seller.service';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-dropdown-popover',
  templateUrl: './dropdown-popover.component.html',
  styleUrls: ['./dropdown-popover.component.scss']
})
export class DropdownPopoverComponent implements OnInit {
  parameterData: string | undefined;
  sellers$: Observable<IProductSeller[]> | undefined;
  cat_pages = [
    { title: 'Electronics', path: '/category/Electronics', nav: '' },
    { title: 'Sports and Outdoors', path: '/category/Sports%20and%20Outdoors', nav: '' },
    { title: 'Clothing', path: '/category/Clothing', nav: ''},
    { title: 'Home and Kitchen', path: '/category/Home%20and%20Kitchen', nav: '' },
    { title: 'Health and Beauty', path: '/category/Health%20and%20Beauty', nav: '' },
    { title: 'Toys and Games', path: '/category/Toys%20and%20Games', nav: '' },
    { title: 'Books', path: '/category/Books', nav:'' }
  ];  

  sel_pages = [
    { title: 'Amazon', path: 'seller-details', nav: '36cc45f7-82ce-45b5-b56d-98683c0e06bf' },
    { title: 'Makro', path: 'seller-details', nav: '7d48c8ab-d272-4ee3-82ce-fe7b8966e9fa' },
    { title: 'Takealot', path: 'seller-details', nav: 'a3d5eea7-f2d1-42bb-8f60-4c000af7f6b0' },
    { title: 'Become a seller', path: '/register', nav: '' }
  ];
  pages = [{ title: '', path: '', nav: '' }];

  constructor(private router: Router, private popoverController: PopoverController, //private productSellerService: ProductSellerService
  ) {

  }
  ngOnInit(): void {
    if (this.parameterData === 'Cat') { this.pages = this.cat_pages; }
    else {
      this.pages = this.sel_pages;
    }
  }

  async onItemClicked(path: string,nav:string) {
    await this.popoverController.dismiss();
    // Redirect to the selected page using the provided path
    if (this.parameterData === 'Cat'||path==='/register') {
      this.router.navigate([path]);
    } else{
      const navigationextras: NavigationExtras = {
        queryParams: { seller_id: nav },

      };
      console.log(nav)
      this.router.navigate([path], navigationextras);
    }
  }
}
