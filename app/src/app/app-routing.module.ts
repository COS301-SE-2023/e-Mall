import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SellerRegisterComponent } from '@features/sign-up/seller/components/seller-register.component';
import { ConsumerRegisterComponent } from '@features/sign-up/consumer/components/consumer-register.component';
import { SignInComponent } from './features/sign-in/components/sign-in.component';
import { ProfileComponent } from '@features/profile/components/profile.component';
import { CategoryComponent } from '@features/category/category.component';
import { postAuthGuard } from '@shared/guards/post-auth.guard';
import { preAuthGuard } from '@shared/guards/pre-auth.guard';
import { baseGuard } from '@shared/guards/base.guard';
import { sellerTypeGuard } from '@shared/guards/seller-type.guard';
import { SellerDetailsComponent } from '@features/seller-details/seller-details.component';
import { SellerDataResolver } from '@features/seller-details/seller-details-resolver';
import { CustomerProfileComponent } from '@features/profile/components/customer-profile/customer-profile.component';
import { WishlistComponent } from '@features/wishlist/wishlist.component';
import { EditCustomerProfileComponent } from '@features/edit-customer-profile/edit-customer-profile.component';
import { SellerDashboardSettingsComponent } from '@features/seller-dashboard-settings/seller-dashboard-settings.component';
import { consumerTypeGuard } from '@shared/guards/consumer-type.guard';
import { MyCombosComponent } from '@features/my-combos/my-combos.component';
import { ComboComponent } from '@features/combo/combo.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'home',
    loadChildren: () =>
      import('@app/features/home/home.module').then(m => m.HomeModule),
    canActivate: [baseGuard],
  },
  {
    path: 'construction',
    loadChildren: () =>
      import('@app/features/construction/construction.module').then(
        m => m.ConstructionModule
      ),
    canActivate: [baseGuard],
  },
  {
    path: 'search-results',
    loadChildren: () =>
      import('@app/features/search/search.module').then(m => m.SearchModule),
    canActivate: [baseGuard],
  },
  { path: 'category/:category', component: CategoryComponent },
  {
    path: 'pending',
    loadChildren: () =>
      import('@app/features/pending/pending.module').then(m => m.PendingModule),
    canActivate: [postAuthGuard, sellerTypeGuard],
  },
  {
    path: 'register',
    component: SellerRegisterComponent,
    canActivate: [baseGuard],
  },
  { path: 'sign-in', component: SignInComponent, canActivate: [preAuthGuard] },

  {
    path: 'sign-up',
    component: ConsumerRegisterComponent,
    canActivate: [preAuthGuard],
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('@app/features/inventory/inventory.module').then(
        m => m.InventoryModule
      ),
    canActivate: [postAuthGuard, sellerTypeGuard],
  },
  {
    path: 'seller-details',
    component: SellerDetailsComponent,
    resolve: { sellerData: SellerDataResolver },
  },
  {
    path: 'about',
    loadChildren: () =>
      import('@app/features/about/about.module').then(m => m.AboutModule),
    canActivate: [baseGuard],
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('@app/features/sales/sales.module').then(m => m.SalesModule),
    canActivate: [postAuthGuard, sellerTypeGuard],
  },
  {
    path: 'product-analytics',
    loadChildren: () =>
      import('@app/features/product-analytics/product-analytics.module').then(
        m => m.ProductAnalyticsModule
      ),
    canActivate: [postAuthGuard, sellerTypeGuard],
  },

  {
    path: 'contact',
    loadChildren: () =>
      import('@app/features/contact/contact.module').then(m => m.ContactModule),
    canActivate: [baseGuard],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@app/features/product/product.module').then(m => m.ProductModule),
    canActivate: [baseGuard],
  },
  { path: 'policies-and-privacy', redirectTo: '/construction' },
  { path: 'ads', redirectTo: '/construction' },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  /*{
    path: 'customer-profile',
    loadChildren: () =>
      import('@app/features/profile/components/customer-profile/customer-profile.module').then(m => m.CustomerProfileModule),
  },*/
  {
    path: 'customer-profile',
    component: CustomerProfileComponent,
    canActivate: [baseGuard, consumerTypeGuard],
  },
  {
    path: 'wishlist',
    loadChildren: () =>
      import('@app/features/wishlist/wishlist.module').then(
        m => m.WishlistModule
      ),
    canActivate: [consumerTypeGuard],
  },
  {
    path: 'my-combos',
    loadChildren: () =>
      import('@app/features/my-combos/my-combos.module').then(
        m => m.MyCombosModule
      ),
    canActivate: [consumerTypeGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'combo',
    loadChildren: () =>
      import('@app/features/combo/combo.module').then(m => m.ComboModule),
    canActivate: [consumerTypeGuard],
  },
  {
    path: 'edit-customer-profile',
    component: EditCustomerProfileComponent,
    canActivate: [consumerTypeGuard],
  },
  {
    path: 'seller-dashboard-settings',
    component: SellerDashboardSettingsComponent,
    canActivate: [sellerTypeGuard],
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
