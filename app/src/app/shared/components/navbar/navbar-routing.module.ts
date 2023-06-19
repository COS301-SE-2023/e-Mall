import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from '@app/features/search-results/search-results.component';
import { SignInComponent } from '@app/features/sign-in/sign-in.component';
import { SignOutComponent } from '@app/features/sign-out/sign-out.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-out', component: SignOutComponent },
  { path: 'search-results', component: SearchResultsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavbarRoutingRoutingModule {}
