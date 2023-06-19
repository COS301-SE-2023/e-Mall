import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerRegisterComponent } from './seller-register.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SellerRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerRegisterRoutingModule {}
