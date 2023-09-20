import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboBreadcrumbComponent } from './components/combo-breadcrumb.component';
import { ComboBreadcrumbFacade } from './services/combo-breadcrumb.facade';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewSizeModule } from '@shared/directives/view-size/view-size.module';

@NgModule({
  declarations: [ComboBreadcrumbComponent],
  imports: [CommonModule, RouterModule, IonicModule, ViewSizeModule],
  exports: [ComboBreadcrumbComponent],
  providers: [ComboBreadcrumbFacade],
})
export class ComboBreadcrumbModule {}
