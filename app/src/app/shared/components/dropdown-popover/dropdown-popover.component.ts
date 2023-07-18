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
    { title: 'Electronics', path: '/construction' },
    { title: 'Sports and Outdoors', path: '/construction' },
    { title: 'Clothing', path: '/construction' },
    { title: 'Home and Kitchen', path: '/construction' },
    { title: 'Health and Beauty', path: '/construction' },
    { title: 'Toys and Games', path: '/construction' },
    { title: 'Books', path: '/construction' }
  ];

  constructor(private router: Router, private popoverController: PopoverController) {}

  async onItemClicked(path: string) {
    await this.popoverController.dismiss();
    // Redirect to the selected page using the provided path
    this.router.navigate([path]);
    console.log('Navigate to:', path);
  }
}
