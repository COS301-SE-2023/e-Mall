/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from '@angular/core';

import { Router} from '@angular/router';

@Component({
  selector: 'app-seller-nav',
  templateUrl: './seller-nav.component.html',
  styleUrls: ['./seller-nav.component.scss'],
})
export class SellerNavComponent {
  constructor(private router: Router) {
  }
navigateTo(page: string): void {
  this.router.navigate([`/${page}`]);
}
}
