import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { IProduct } from '../models/product.interface';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  searchQuery!: string;
  searchResults$: Observable<IProduct[]> | undefined;
  isAuthenticated!: boolean;
  page!: number[];

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
      this.searchResults$.subscribe(results => {
        console.log(results);
      });
    });
  }

  // getSearchResults(): void {
  //   this.productService
  //     .searchProducts(this.searchQuery)
  //     .subscribe(async results => {
  //       this.searchResults = await results;
  //     });
  //   console.log(this.searchResults);
  // }

  signOut(): void {
    this.router.navigate(['sign-out']);
  }

  getOneImg(imgList?: string[]): string {
    if(!imgList || imgList.length < 1)
      return '';
    return imgList[0];
  }
}

