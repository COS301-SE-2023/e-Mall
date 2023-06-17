import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  ExtraOptions,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { RegisterComponent } from './register/register.component';

import { PendingComponent } from './pending/pending.component';
import { ConstructionComponent } from './construction/construction.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SearchResultsComponent } from './search-results/search-results.component'; 

const routes: Routes = [
  // {
  //   path: '**',
  //   redirectTo: 'signIn',
  // },
  { path: 'home', component: HomeComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'construction', component: ConstructionComponent },
  { path: 'pending', component: PendingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-out', component: SignOutComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'products/:id', component: ProductPageComponent },
];
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withComponentInputBinding())],
});
@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
