import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IProduct } from '@shared/models/product/product.interface';
import { ProductService } from '@shared/servicies/product/product.service';
import { Observable } from 'rxjs';


@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  
  categoryName!: string;
  categoryProducts$: Observable<IProduct[]> | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
   this.route.params.subscribe(params => {
      this.categoryName = params['category'];
      this.categoryProducts$ = this.productService.getCategoryProducts(this.categoryName);
    });

    
   console.log(this.categoryProducts$);
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

    this.router.navigate(['products'], navigationextras);
  }
}
