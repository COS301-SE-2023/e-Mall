import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComboCardComponent } from './combo-cards.component';

@NgModule({
  declarations: [ComboCardComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatListModule,
    MatCardModule,
    IonicModule,
    ComboCardComponent
  ],
  exports: [ComboCardComponent],
})
export class ComboCardModule {}
