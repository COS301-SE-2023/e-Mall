import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavbarRoutingRoutingModule } from './navbar-routing.module';
import { SignInComponent } from '@app/features/sign-in/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignOutComponent } from '@app/features/sign-out/sign-out.component';
import { ViewSizeDirective } from '@shared/directives/view-size.directive';
import { MatInputModule } from '@angular/material/input';
import { SearchBarModule } from '@shared/components/search-bar/search-bar.module';
import { SignOutModule } from '../../../features/sign-out/sign-out.module';
import { SignInModule } from '@app/features/sign-in/sign-in.module';
import { ConsumerRegisterModule } from '../../../features/sign-up/consumer/consumer-register.module';
import { SellerRegisterModule } from '../../../features/sign-up/seller/seller-register.module';
@NgModule({
  declarations: [
    NavbarComponent,
    // SignInComponent,
    // SignOutComponent,
    ViewSizeDirective,
  ],
  imports: [
    NavbarRoutingRoutingModule,
    CommonModule,
    FormsModule,
    SearchBarModule,
    ReactiveFormsModule,
    SignInModule,
    SignOutModule,
    ConsumerRegisterModule,
    SellerRegisterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [NavbarComponent],
})
export class NavbarModule {}
