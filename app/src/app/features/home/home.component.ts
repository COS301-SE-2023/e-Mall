import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
//import { AuthService } from '@app/services/auth/auth.service';
import { ProductService } from '@app/services/product/product.service';
import { IProduct } from '@app/models/product/product.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  popProducts$: Observable<IProduct[]> | undefined;
  forYouProducts$: Observable<IProduct[]> | undefined;
  // isAuthenticated = false;
  images = 'assets/images/comingSoon.jpg';
  // isAuthenticated$;
  constructor(
    // private authService: AuthService,
    private router: Router,
    private productService: ProductService
  ) {
    // this.isAuthenticated$ = this.authService.isAuthenticated();
    // this.isAuthenticated$.subscribe(val => console.log('Home [Auth]: ', val));
    // this.authService.isAuthenticated().subscribe(val => {
    //   this.isAuthenticated = val;
    // });
  }

  ngOnInit(): void {
    this.fetchforYouProducts();
    this.fetchPopProducts();
  }

  fetchPopProducts() {
    //Need to implement AI algo
    //Mock data below
    this.popProducts$ = this.productService.getPopProducts();
    this.popProducts$?.subscribe((res: IProduct[]) => {
      console.log('getProductList');
      console.log(res);
    });
  }

  fetchforYouProducts() {
    //Need to implement AI algo
    //Mock data below
    this.forYouProducts$ = this.productService.getForYouProducts();
    this.forYouProducts$?.subscribe((res: IProduct[]) => {
      console.log('getProductList');
      console.log(res);
    });
  }

  search(searchQuery: string): void {
    // Create the navigation extras object with the search query as a parameter
    const navigationextras: NavigationExtras = {
      queryParams: { search: searchQuery },
    };

    this.router.navigate(['/search-results'], navigationextras);
  }

  goToProductPage(prod_id: number): void {
    // Create the navigation extras object with the search query as a parameter
    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };
    // console.log(prod_id);

    this.router.navigate(['products'], navigationextras);
  }

  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    return imgList[0];
  }
}
