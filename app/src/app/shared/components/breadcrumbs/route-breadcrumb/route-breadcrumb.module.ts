import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteBreadcrumbComponent } from './components/route-breadcrumb.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { ViewSizeModule } from '@shared/directives/view-size/view-size.module';
import { RouterModule } from '@angular/router';
import { RouteBreadcrumbFacade } from './services/route-breadcrumb.facade';

@NgModule({
  declarations: [RouteBreadcrumbComponent],
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    RouterModule,
    IonicModule,
    ViewSizeModule,
  ],
  exports: [RouteBreadcrumbComponent],
  providers: [RouteBreadcrumbFacade],
})
export class RouteBreadcrumbModule {}
