import { Component, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: 'product-card.component.html',
  styleUrls: ['product-card.component.scss']
})
export class ProductCardComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() product: any;
  isHearted = false;

  constructor(private router: Router){}

  toggleHeart() {
    this.isHearted = !this.isHearted;
}

goToProductPage(prod_id: number): void {
  // Create the navigation extras object with the search query as a parameter

  const navigationextras: NavigationExtras = {
    queryParams: { prod_id: prod_id },
  };

  this.router.navigate(['products'], navigationextras);

  console.log('heyy');
  console.log(prod_id);
}
}
