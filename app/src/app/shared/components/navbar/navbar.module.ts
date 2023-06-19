import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewSizeDirective } from '@shared/directives/view-size.directive';
import { MatInputModule } from '@angular/material/input';
import { SearchBarModule } from '@shared/components/search-bar/search-bar.module';

@NgModule({
  declarations: [NavbarComponent, ViewSizeDirective],
  imports: [
    CommonModule,
    FormsModule,
    SearchBarModule,
    ReactiveFormsModule,
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
