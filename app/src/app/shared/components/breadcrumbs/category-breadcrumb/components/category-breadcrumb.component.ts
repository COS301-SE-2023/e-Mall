/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CategoryBreadcrumbFacade } from '../services/category-breadcrumb.facade';
import { ICategoryBreadcrumb } from '../models/category-breadcrumb.interface';

@Component({
  selector: 'app-category-breadcrumb',
  templateUrl: './category-breadcrumb.component.html',
  styleUrls: ['./category-breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryBreadcrumbComponent implements OnInit {
  @Input()
  categoryList: any;
  @Input()
  isProductPage = false;
  crumbs: ICategoryBreadcrumb[] = [];
  constructor(public categoryBreadcrumbFacade: CategoryBreadcrumbFacade) {}

  ngOnInit(): void {
    this.crumbs = this.categoryBreadcrumbFacade.getBreadcrumbs(
      this.categoryList,
      this.isProductPage
    );
  }
}
