import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSizeDirective } from './view-size.directive';

@NgModule({
  declarations: [ViewSizeDirective],
  imports: [CommonModule],
  exports: [ViewSizeDirective],
})
export class ViewSizeModule {}
