import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerRegisterComponent } from './components/consumer-register.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ConsumerRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerRegisterRoutingModule {}
