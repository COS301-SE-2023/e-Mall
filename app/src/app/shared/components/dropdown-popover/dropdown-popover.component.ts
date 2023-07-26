// dropdown-popover.component.ts

import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ProductSellerService } from '@shared/servicies/product-seller/product-seller.service';
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
    { title: 'Electronics', path: '/category/Electronics' },
    { title: 'Sports and Outdoors', path: '/category/Sports%20and%20Outdoors' },
    { title: 'Clothing', path: '/category/Clothing' },
    { title: 'Home and Kitchen', path: '/category/Home%20and%20Kitchen' },
    { title: 'Health and Beauty', path: '/category/Health%20and%20Beauty' },
    { title: 'Toys and Games', path: '/category/Toys%20and%20Games' },
    { title: 'Books', path: '/category/Books' }
  ];

  sel_pages = [
    { title: 'Amazon', path: '/construction' },
    { title: 'Makro', path: '/construction' },
    { title: 'Takealot', path: '/construction' }
  ];
  pages = [{ title: '', path: '' }];

  constructor(private router: Router, private popoverController: PopoverController, private productSellerService: ProductSellerService) {

  }
  ngOnInit(): void {
    if (this.parameterData === 'Cat') { this.pages = this.cat_pages; }
    else {
      this.getSellers();
    }
  }

  async onItemClicked(path: string) {
    await this.popoverController.dismiss();
    // Redirect to the selected page using the provided path
    this.router.navigate([path]);
  }
  getSellers(){
    //this.sellers$=this.productSellerService.getAllSellers();
    this.pages=this.sel_pages;
  }
}
