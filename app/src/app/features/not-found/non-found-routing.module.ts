import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '@app/features/not-found/not-found.component';

const routes: Routes = [{ path: '', component: NotFoundComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonFoundRoutingModule {}
