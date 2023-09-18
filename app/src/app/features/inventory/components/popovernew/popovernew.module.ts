import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopovernewComponent } from './popovernew.component';
import { SellerNavModule } from '@app/shared/components/seller-nav/seller-nav.module';
import { PopovernewRoutingModule } from './popovernew.routing.module';
import { InventoryFacade } from '../../servicies/inventory.facade';
import { InventoryService } from '../../servicies/inventory.service';

@NgModule({
  declarations: [PopovernewComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule,SellerNavModule,PopovernewRoutingModule],
  exports: [PopovernewComponent],
  providers: [InventoryService, InventoryFacade],
})
export class PopovernewModule {}