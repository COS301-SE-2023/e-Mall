/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { ICategoryBreadcrumb } from '../models/category-breadcrumb.interface';
import { IProduct } from '@app/shared/models/product/product.interface';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Injectable()
export class CategoryBreadcrumbFacade {
  constructor(private router: Router, private route: ActivatedRoute) {}

  getBreadcrumbs(product: IProduct | string): ICategoryBreadcrumb[] {
    if (typeof product === 'string') {
      const url = '/category/' + product;
      const crumbs: ICategoryBreadcrumb[] = [
        { label: 'Home', url: '/home' },
        {
          label: product,
          url: url,
        },
      ];
      return crumbs;
    } else {
      const url = '/category/' + product.category;
      if (product.name.length > 30) {
        product.name = product.name.substring(0, 30) + '...';
      }
      const crumbs: ICategoryBreadcrumb[] = [
        { label: 'Home', url: '/home' },
        {
          label: product.category,
          url: url,
        },
        {
          label: product.name,
          url: product.id,
        },
      ];
      return crumbs;
    }
  }
  navigateTo(url: string): void {
    if (url.includes('home') || url.includes('category')) {
      this.router.navigate([url]);
    } else {
      const navigationextras: NavigationExtras = {
        queryParams: { prod_id: Number(url) },
      };
      this.router.navigate(['products'], navigationextras);
    }
  }
}
