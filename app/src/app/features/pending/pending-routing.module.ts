import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingComponent } from './pending.component';

const routes: Routes = [{ path: '', component: PendingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingRoutingModule {}
