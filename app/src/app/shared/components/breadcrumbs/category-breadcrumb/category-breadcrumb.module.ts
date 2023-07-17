import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryBreadcrumbComponent } from './components/category-breadcrumb.component';
import { CategoryBreadcrumbFacade } from './services/category-breadcrumb.facade';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewSizeModule } from '@shared/directives/view-size/view-size.module';

@NgModule({
  declarations: [CategoryBreadcrumbComponent],
  imports: [CommonModule, RouterModule, IonicModule, ViewSizeModule],
  exports: [CategoryBreadcrumbComponent],
  providers: [CategoryBreadcrumbFacade],
})
export class CategoryBreadcrumbModule {}
