// dropdown-popover.component.ts

import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dropdown-popover',
  templateUrl: './dropdown-popover.component.html',
  styleUrls: ['./dropdown-popover.component.scss']
})
export class DropdownPopoverComponent {

  pages = [
    { title: 'Electronics', path: '/category/Electronics' },
    { title: 'Sports and Outdoors', path: '/category/Sports%20and%20Outdoors' },
    { title: 'Clothing', path: '/category/Clothing' },
    { title: 'Home and Kitchen', path: '/category/Home%20and%20Kitchen' },
    { title: 'Health and Beauty', path: '/category/Health%20and%20Beauty' },
    { title: 'Toys and Games', path: '/category/Toys%20and%20Games' },
    { title: 'Books', path: '/category/Books' }
  ];
  

  constructor(private router: Router, private popoverController: PopoverController) {}

  async onItemClicked(path: string) {
    await this.popoverController.dismiss();
    // Redirect to the selected page using the provided path
    this.router.navigate([path]);
  }
}
