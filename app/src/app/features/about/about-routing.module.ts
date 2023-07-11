import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about.component';
import { ConstructionComponent } from '../construction/construction.component';

const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    component: AboutComponent,
    children: [
      {
        path: 'a',
        component: ConstructionComponent,
        children: [
          {
            path: 'b',
            component: AboutComponent,
            children: [
              {
                path: 'c',
                component: ConstructionComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutRoutingModule {}
