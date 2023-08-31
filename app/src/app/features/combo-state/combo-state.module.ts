import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ComboState } from './states/combo.state';
import { ComboService } from './services/combo.service';
import { ComboFacade } from './services/combo.facade';
import { ComboRoutingModule } from './combo-routing.module';
import { ComboComponent } from './components/combo.component';



@NgModule({
  declarations: [ComboComponent],
  imports: [
    CommonModule,
    NgxsModule.forFeature([ComboState]),

  ],
  exports: [ComboComponent],
  providers: [ComboService, ComboFacade],
})
export class ComboStateModule { }
