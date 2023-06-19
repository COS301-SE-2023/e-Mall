import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SignUpComponent } from './features/sign-up/sign-up.component';

import { RegisterComponent } from './features/register/register.component';

import { PendingComponent } from './features/pending/pending.component';
import { ConstructionComponent } from './features/construction/construction.component';
import { ProductPageComponent } from './features/product-page/product-page.component';
import { SearchResultsComponent } from './features/search-results/search-results.component';
import { NotFoundComponent } from '@app/features/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'construction', component: ConstructionComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'pending', component: PendingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'products/:id', component: ProductPageComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
