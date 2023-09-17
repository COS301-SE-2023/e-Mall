/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { ICategoryBreadcrumb } from '../models/category-breadcrumb.interface';

@Injectable()
export class CategoryBreadcrumbFacade {
  getBreadcrumbs(
    categoryList: string[] | string | undefined,
    isProductPage: boolean
  ): ICategoryBreadcrumb[] {
    const crumbs: ICategoryBreadcrumb[] = [{ label: 'Home', url: '/home' }];
    let data: string[] = [];
    if (typeof categoryList === 'string' || Array.isArray(categoryList)) {
      if (typeof categoryList === 'string') {
        data = [categoryList];
      } else {
        data = categoryList;
      }
    }
    if (data)
      for (const category of data) {
        if (isProductPage)
          crumbs.push({
            label: category,
            url: `/category/${category}`,
            isProductPage: true,
          });
        else
          crumbs.push({
            label: category,
            url: `/category/${category}`,
            isProductPage: false,
          });
      }

    return crumbs;
  }
}
