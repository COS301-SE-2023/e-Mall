import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavbarRoutingRoutingModule } from './navbar-routing.module';
import { SignInComponent } from '@app/sign-in/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignOutComponent } from '@app/sign-out/sign-out.component';

@NgModule({
  declarations: [NavbarComponent, SignInComponent, SignOutComponent],
  imports: [
    NavbarRoutingRoutingModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [NavbarComponent],
})
export class NavbarModule {}
