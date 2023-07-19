import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SellerRegisterComponent } from '@features/sign-up/seller/components/seller-register.component';
import { ConsumerRegisterComponent } from '@features/sign-up/consumer/components/consumer-register.component';
import { SignInComponent } from './features/sign-in/components/sign-in.component';
import { SignOutComponent } from './features/sign-out/sign-out.component';
import { ProfileComponent } from '@features/profile/components/profile.component';
import { CategoryComponent } from '@features/category/category.component';
import { authGuard } from '@shared/route-guards/auth-guard/auth-guard.service';
import { routeGuard } from '@shared/route-guards/route-guard/route-guard.service';

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
  { path: 'category/:category', component: CategoryComponent },
  {
    path: 'pending',
    loadChildren: () =>
      import('@app/features/pending/pending.module').then(m => m.PendingModule),
    canActivate: [authGuard],
  },
  {
    path: 'register',
    component: SellerRegisterComponent,
    canActivate: [routeGuard],
  },
  { path: 'sign-in', component: SignInComponent, canActivate: [routeGuard] },
  { path: 'sign-out', component: SignOutComponent },
  {
    path: 'sign-up',
    component: ConsumerRegisterComponent,
    canActivate: [routeGuard],
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('@app/features/inventory/inventory.module').then(
        m => m.InventoryModule
      ),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('@app/features/about/about.module').then(m => m.AboutModule),
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('@app/features/sales/sales.module').then(m => m.SalesModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('@app/features/contact/contact.module').then(m => m.ContactModule),
  },
  // {
  //   path: '',
  //   component: ProductComponent,
  // },
  {
    path: 'products',
    loadChildren: () =>
      import('@app/features/product/product.module').then(m => m.ProductModule),
  },
  { path: 'policies-and-privacy', redirectTo: '/construction' },
  { path: 'ads', redirectTo: '/construction' },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  // {
  //   path: 'profile',
  //   loadChildren: () =>
  //     import('@app/features/profile/profile.module').then(m => m.ProfileModule),
  // },
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
