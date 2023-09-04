import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCombosComponent } from './my-combos.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: MyCombosComponent },
];
@NgModule({
  imports: [
    CommonModule,
    FooterModule,
    NavbarModule,
    IonicModule,
    CustomerProfileSidenavModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes),
  ],
  declarations: [MyCombosComponent],
  exports:[RouterModule],
})
export class MyCombosModule { }
