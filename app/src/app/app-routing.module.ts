import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PendingComponent } from './features/pending/pending.component';
import { ConstructionComponent } from './features/construction/construction.component';
// import { ProductComponent } from './features/product/product.component';
import { SearchComponent } from './features/search/search.component';
import { NotFoundComponent } from '@app/features/not-found/not-found.component';
import { SellerRegisterComponent } from './features/sign-up/seller/seller-register.component';
import { ConsumerRegisterComponent } from './features/sign-up/consumer/consumer-register.component';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { SignOutComponent } from './features/sign-out/sign-out.component';
import { ContactComponent } from './features/contact/contact.component';
import { AboutComponent } from './features/about/about.component';
import { ProductComponent } from './features/product/product.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'construction', component: ConstructionComponent },
  { path: 'search-results', component: SearchComponent },
  { path: 'pending', component: PendingComponent },
  { path: 'register', component: SellerRegisterComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-out', component: SignOutComponent },
  { path: 'search-results', component: SearchComponent },
  { path: 'sign-up', component: ConsumerRegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductComponent },
  { path: 'policies-and-privacy', redirectTo: '/construction' },
  { path: 'seller/dashboard', redirectTo: '/construction' },
  { path: 'ads', redirectTo: '/construction' },
  { path: '**', component: NotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
