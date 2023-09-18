import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InventoryComponent } from './components/inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { SellerNavModule } from '@shared/components/seller-nav/seller-nav.module';
import { InventoryService } from './servicies/inventory.service';
import { InventoryFacade } from './servicies/inventory.facade';
import { PopovereditModule } from './components/popoveredit/popoveredit.module';
import { PopovernewModule } from './components/popovernew/popovernew.module';
import { NgxsModule } from '@ngxs/store';
import { InventoryState } from './states/inventory.state';

@NgModule({
  declarations: [InventoryComponent],
  imports: [
    CommonModule,
    NgxsModule.forFeature([InventoryState]),
    MatDividerModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryRoutingModule,
    SellerNavModule,
    PopovereditModule,
  ],
  exports: [InventoryComponent],
  providers: [InventoryService, InventoryFacade],
})
export class InventoryModule {}
