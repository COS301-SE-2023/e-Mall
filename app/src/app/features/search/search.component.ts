import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@app/services/product/product.service';
import { IProduct } from '@app/models/product/product.interface';
import { Router, NavigationExtras } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProductComponent } from '../product/product.component';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchQuery!: string;
  searchResults$: Observable<IProduct[]> | undefined;
  isAuthenticated!: boolean;
  min_price_in_stock!: number;
  page!: number[];
  categoryElectronics!: boolean;
  categoryClothing!: boolean;
  categoryHomeAndKitchen!: boolean;
  categoryHealthAndBeauty!: boolean;
  categorySportsAndOutdoors!: boolean;
  categoryToysAndGames!: boolean;
  categoryBooks!: boolean;
  categoryFoodAndBeverages!: boolean;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'];
      this.searchResults$ = this.productService.searchProducts(
        this.searchQuery
      );
      this.searchResults$?.subscribe((res: IProduct[]) => {
        console.log('getProductList');
        console.log(res);
      });
    });
  }

  //

  signOut(): void {
    this.router.navigate(['sign-out']);
  }

  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    return imgList[0];
  }

  goToProductPage(prod_id: number): void {
    // Create the navigation extras object with the search query as a parameter
    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };
    console.log(prod_id);

    this.router.navigate(['products', prod_id], navigationextras);
  }
}