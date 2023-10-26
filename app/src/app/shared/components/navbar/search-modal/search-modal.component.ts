import { ModalController } from '@ionic/angular';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { IProduct } from '@shared/models/product/product.interface';
import { faker } from '@faker-js/faker';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent {
  @ViewChild('searchInput', { static: false }) searchField:
    | ElementRef
    | undefined;
  searchInputController = new FormControl('');
  searchInputPreviousText: string;
  placeHolder: string;
  suggestions$ = new Observable<IProduct[]>();
  keyEventSubscription: Subscription = new Subscription();
  suggestionSubscription: Subscription = new Subscription();
  isSuggesting: boolean;
  isSearching: boolean; // its for loading, but maybe not used

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {
    this.placeHolder = 'What are you looking for?';
    this.isSearching = false;
    this.isSuggesting = false;
    this.searchInputPreviousText = '';
  }

  closeMenuModal() {
    this.modalController.dismiss();
  }
  keyUpFunction(event: any) {
    this.closeMenuModal();
    this.search();
  }
  keyDownFunction(event: any) {
    if (
      event.code === 'Enter' ||
      event.code === 'NumpadEnter' ||
      event.code === 13
    ) {
      this.closeMenuModal();
      this.search();
    }
  }

  searchIconFunction() {
    if (this.searchInputController.value !== '') {
      this.closeMenuModal();
      this.search();
    }
  }

  //api call to get suggestions
  getSuggestion(): Observable<IProduct[]> {
    return of(this.generateRandomProducts());
  }
  // api call to get search result
  search(): void {
    // Create the navigation extras object with the search query as a parameter
    if (this.searchInputController.value !== this.searchInputPreviousText) {
      const navigationextras: NavigationExtras = {
        queryParams: { search: this.searchInputController.value },
      };
      this.router.navigate(['/search-results'], navigationextras);
    }
    this.searchInputController.reset();
  }

  ///for mocking
  generateRandomProducts(): IProduct[] {
    const products: IProduct[] = [];
    for (let i = 0; i < 3; i++) {
      const minPrice = faker.number.int({ min: 1, max: 100 });

      products.push({
        id: faker.number.int(),
        min_price_img_array: [faker.image.url(), faker.image.url()],
        name: faker.commerce.productName(),
        brand: faker.company.name(),
        category: faker.commerce.department(),
        min_price: minPrice,
      });
    }
    return products;
  }
}
