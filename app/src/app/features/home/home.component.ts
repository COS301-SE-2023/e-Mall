import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
//import { AuthService } from '@app/services/auth/auth.service';
import { ProductService } from '@shared/servicies/product/product.service';
import { IProduct } from '@shared/models/product/product.interface';
import { Observable } from 'rxjs';

//import { register } from 'swiper/element/bundle';
//register();
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  popProducts$: Observable<IProduct[]> | undefined;
  forYouProducts$: Observable<IProduct[]> | undefined;
  // isAuthenticated = false;
  images = 'assets/images/home_banner.png';
  @ViewChild('recommendedHeading') recommendedHeading!: ElementRef;
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
  }

  fetchforYouProducts() {
    //Need to implement AI algo
    //Mock data below
    this.forYouProducts$ = this.productService.getForYouProducts();
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
  
  async onAllClick() {
    if (this.recommendedHeading) {
      this.recommendedHeading.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    return imgList[0];
  }
}
