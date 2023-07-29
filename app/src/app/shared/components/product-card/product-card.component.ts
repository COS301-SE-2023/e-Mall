import { Component, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { ProfileFacade } from '@features/profile/services/profile.facade';

@Component({
  selector: 'app-product-card',
  templateUrl: 'product-card.component.html',
  styleUrls: ['product-card.component.scss'],
})
export class ProductCardComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() product: any;
  isHearted = of(false);

  constructor(private router: Router, private profileFacade: ProfileFacade) {}

  ngOnInIt(): void {
    this.isHearted = this.profileFacade.checkWishlist(this.product.id);
  }
  toggleHeart() {
    console.log('toggling heart', this.product);
    this.profileFacade.toggleWishlist(this.product.id);
    
  }

  goToProductPage(prod_id: number): void {
    // Create the navigation extras object with the search query as a parameter

    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };

    this.router.navigate(['products'], navigationextras);

    console.log(prod_id);
  }
  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    return imgList[0];
  }
}
