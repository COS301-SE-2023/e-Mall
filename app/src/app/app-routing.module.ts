import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  ExtraOptions,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { HomeComponent } from './home/home.component';
// import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { RegisterComponent } from './register/register.component';

import { PendingComponent } from './pending/pending.component';
import { ConstructionComponent } from './shared/pages/construction/construction.component';
import { ProductPageComponent } from './product-page/product-page.component';
// import { SignOutComponent } from './sign-out/sign-out.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { NotFoundComponent } from '@shared/pages/not-found/not-found.component';

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
// bootstrapApplication(AppComponent, {
//   providers: [provideRouter(routes, withComponentInputBinding())],
// });
@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
