import { Component, OnInit } from '@angular/core';

import { ProductPageService } from '@service/product-page.service';



@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit{

  products: any;

  constructor(private productService: ProductPageService) {}

  ngOnInit() {
    this.productService.getProductData().subscribe(
      (response) => {
        this.products = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
