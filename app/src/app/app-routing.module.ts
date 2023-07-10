import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SellerRegisterComponent } from '@features/sign-up/seller/components/seller-register.component';
import { ConsumerRegisterComponent } from '@features/sign-up/consumer/components/consumer-register.component';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { SignOutComponent } from './features/sign-out/sign-out.component';
import { ProductComponent } from './features/product/product.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'construction',
    loadChildren: () =>
      import('@app/features/construction/construction.module').then(
        m => m.ConstructionModule
      ),
  },
  {
    path: 'search-results',
    loadChildren: () =>
      import('@app/features/search/search.module').then(m => m.SearchModule),
  },
  {
    path: 'pending',
    loadChildren: () =>
      import('@app/features/pending/pending.module').then(m => m.PendingModule),
  },
  { path: 'register', component: SellerRegisterComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-out', component: SignOutComponent },
  { path: 'sign-up', component: ConsumerRegisterComponent },
  {
    path: 'about',
    loadChildren: () =>
      import('@app/features/about/about.module').then(m => m.AboutModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('@app/features/contact/contact.module').then(m => m.ContactModule),
  },
  {
    path: 'products',
    component: ProductComponent,
  },
  { path: 'policies-and-privacy', redirectTo: '/construction' },
  { path: 'seller/dashboard', redirectTo: '/construction' },
  { path: 'ads', redirectTo: '/construction' },
  {
    path: '**',
    loadChildren: () =>
      import('@app/features/not-found/not-found.module').then(
        m => m.NotFoundModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
