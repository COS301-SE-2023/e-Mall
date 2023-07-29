import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductAnalyticsComponent } from './product-analytics.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProductAnalyticsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductAnalyticsRoutingModule {}
