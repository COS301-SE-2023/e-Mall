import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerNavComponent } from './seller-nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SearchBarModule } from '@shared/components/search-bar/search-bar.module';
import { ViewSizeModule } from '@shared/directives/view-size/view-size.module';
import { HttpClientModule } from '@angular/common/http';
//import { AuthService } from '@app/services/auth/auth.service';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [SellerNavComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ViewSizeModule,
    SearchBarModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    IonicModule,
  ],
  //providers: [AuthService],
  exports: [SellerNavComponent],
})
export class SellerNavModule {}
