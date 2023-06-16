import { Component, OnInit } from '@angular/core';

import { ProductPageService } from '@service/product-page.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit {
  products: any;

  constructor(private productService: ProductPageService) {}

  ngOnInit() {
    const id = 1;
    this.productService.getProductData(id).subscribe((res: unknown) => {
      console.log('getProductData');
      console.log(res);
    });
    this.productService.getSellerList(id).subscribe((res: unknown) => {
      console.log('getSellerList');
      console.log(res);
    });
  }
}
