import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { IonicModule } from '@ionic/angular';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { InventoryComponent } from './components/inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { SellerNavModule } from '@shared/components/seller-nav/seller-nav.module';
import { InventoryService } from './servicies/inventory.service';
import { InventoryFacade } from './servicies/inventory.facade';
import { PopovereditModule } from './components/popoveredit/popoveredit.module';
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
