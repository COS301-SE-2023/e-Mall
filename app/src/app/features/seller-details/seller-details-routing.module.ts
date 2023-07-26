import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerDetailsComponent } from './seller-details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SellerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerDetailsRoutingModule {}