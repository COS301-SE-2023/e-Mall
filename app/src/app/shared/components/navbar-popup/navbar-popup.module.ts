import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarPopupComponent } from './navbar-popup.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    NavbarPopupComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [NavbarPopupComponent],
})
export class NavbarPopupModule { }
