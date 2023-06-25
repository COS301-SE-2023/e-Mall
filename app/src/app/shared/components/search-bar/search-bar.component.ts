/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { IProduct } from '@app/models/product/product.interface';
import { faker } from '@faker-js/faker';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  @ViewChild('searchInput', { static: false }) searchField:
    | ElementRef
    | undefined;
  searchInputController = new FormControl('');
  searchInputPreviousText: string;
  placeHolder: string;
  // opened: boolean;
  searchHistories: string[]; // for user search history. implemented later
  // suggestions: IProduct[];
  suggestions$ = new Observable<IProduct[]>();
  keyEventSubscription: Subscription = new Subscription();
  suggestionSubscription: Subscription = new Subscription();
  isSuggesting: boolean;
  isSearching: boolean; // its for loading, but maybe not used

  constructor(private router: Router) {
    this.placeHolder = 'What are you looking for?';
    // this.opened = false; //for mobile
    this.searchHistories = ['one', 'two', 'three']; //mock data
    // this.suggestions = [];
    this.isSearching = false;
    this.isSuggesting = false;
    this.searchInputPreviousText = '';
  }
  keyDownFunction(event: any) {
    if (event.code === 'Enter') {
      //search call
      console.log(
        '[enter] search input was: ',
        this.searchInputController.value
      );
      this.search();
    }
  }
  searchIconFunction() {
    if (this.searchInputController.value !== '') {
      //search call
      console.log(
        '[icon] search input was: ',
        this.searchInputController.value
      );
      this.search();
    }
  }

  //api call to get suggestions
  getSuggestion(): Observable<IProduct[]> {
    console.log('getting suggestions :', this.searchInputController.value);
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

  // for mobile view's search
  // openSearchBar() {
  //   this.opened = true;
  //   this.changeDetectorRef.detectChanges();
  //   this.searchField?.nativeElement.focus();
  //   // this.suggestions$ = this.searchInputController.valueChanges.pipe(map(val));

  //   // this.keyEventSubscription = fromEvent(
  //   //   this.searchField?.nativeElement,
  //   //   'keyup'
  //   // )
  //   //   .pipe(
  //   //     // get value
  //   //     map((event: any) => {
  //   //       return event.target.value;
  //   //     }),
  //   //     // if character length greater then 2
  //   //     filter(res => res.length > 2),

  //   //     // Time in milliseconds between key events
  //   //     debounceTime(1000),

  //   //     // If previous query is diffent from current
  //   //     distinctUntilChanged()

  //   //     // subscription for response
  //   //   )
  //   //   .subscribe((text: string) => {
  //   //     console.log(text);
  //   //     this.isSuggesting = true;
  //   //     // this.suggestionSubscription = this.getSuggestion().subscribe(
  //   //     //   (res: IProduct[]) => {
  //   //     //     this.suggestions = res;
  //   //     //     console.log(this.suggestions);
  //   //     //     this.isSuggesting = false;
  //   //     //   }
  //   //     // );
  //   //     this.suggestions$ = this.getSuggestion();
  //   //   });
  //   this.suggestions$ = this.searchInputController.valueChanges.pipe(
  //     filter(value => value !== null && value.length > 2),
  //     debounceTime(1000),
  //     distinctUntilChanged(),
  //     switchMap(value => this.getSuggestion())
  //   );
  // }
  // closeSearchBar() {
  //   this.opened = false;
  //   this.changeDetectorRef.detectChanges();
  //   this.suggestionSubscription.unsubscribe();
  //   this.keyEventSubscription.unsubscribe();
  //   this.searchInputController.reset();
  //   this.suggestions = [];
  // }
  // onBlur() {
  //   this.opened = false;
  //   this.changeDetectorRef.detectChanges();
  //   this.closeSearchBar();
  // }
}
