import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ErrorFacade } from './services/error.facade';
import { ErrorState } from './states/error.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([ErrorState])],
  providers: [ErrorFacade],
})
export class ErrorModule {}
