import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from '@app/shared/interceptors/index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './features/home/home.module';
import { SignInModule } from './features/sign-in/sign-in.module';
import { SellerRegisterModule } from './features/sign-up/seller/seller-register.module';
import { ConsumerRegisterModule } from './features/sign-up/consumer/consumer-register.module';
import { SignOutModule } from './features/sign-out/sign-out.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { environment } from 'environments/env';
import {
  NavigationActionTiming,
  NgxsRouterPluginModule,
} from '@ngxs/router-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsActionsExecutingModule } from '@ngxs-labs/actions-executing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { AuthModule } from './features/auth/auth.module';
import { ErrorModule } from './features/error/error.module';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { customPageAnimation } from '@shared/animations/custom-page.animation';
import { SellerNavModule } from '@shared/components/seller-nav/seller-nav.module';
import { ProfileModule } from './features/profile/profile.module';
import { DropdownPopoverModule } from '@shared/components/dropdown-popover/dropdown-popover.module'; // Add this line
import { CategoryModule } from '@features/category/category.module';
import { SellerDetailsModule } from '@features/seller-details/seller-details.module';
import { CustomerProfileModule } from '@features/profile/components/customer-profile/customer-profile.module';
import { WishlistModule } from '@features/wishlist/wishlist.module';
import { NavbarPopupModule } from '@shared/components/navbar-popup/navbar-popup.module';
import { EditCustomerProfileModule } from '@features/edit-customer-profile/edit-customer-profile.module';
import { SellerDashboardSettingsModule } from '@features/seller-dashboard-settings/seller-dashboard-settings.module';
import { ComboStateModule } from '@features/combo-state/combo-state.module';
import { MyCombosModule } from '@features/my-combos/my-combos.module';
import { ComboModule } from '@features/combo/combo.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { NotificationModule } from './features/notification/notification.module';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { LoadingInterceptor } from '@shared/components/spinner/interceptors/loading.interceptor';
import { WishlistStateModule } from './features/wishlist/wishlist-state/wishlist-state.module';
@NgModule({
  declarations: [AppComponent],
  // declarations: [AppComponent, SpinnerComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      navAnimation: customPageAnimation,
      innerHTMLTemplatesEnabled: true,
    }),
    NgxsModule.forRoot([]),
    NgxsLoggerPluginModule.forRoot({
      // Do not collapse log groups
      collapsed: true,
      // Do not log in production mode
      disabled: environment.production,
      // Do not log SomeAction
      // filter: action => getActionTypeFromInstance(action) !== SomeAction.type
    }),
    NgxsRouterPluginModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsFormPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot(),
    NgxsActionsExecutingModule.forRoot(),
    NgxsDispatchPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot(),
    AuthModule,
    ErrorModule,
    ComboStateModule,
    WishlistStateModule,
    HomeModule,
    // ProductModule,
    SignInModule,
    SellerRegisterModule,
    ConsumerRegisterModule,
    SignOutModule,
    CustomerProfileModule,
    WishlistModule,
    MyCombosModule,
    ComboModule,
    NavbarPopupModule,
    EditCustomerProfileModule,
    // FooterModule,
    // NavbarModule,
    // AboutModule,

    // SalesModule,
    MatTooltipModule,
    SellerNavModule,
    ProfileModule,
    DropdownPopoverModule,
    CategoryModule,
    AppRoutingModule,
    SellerDetailsModule,
    SellerDashboardSettingsModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideMessaging(() => getMessaging()),
    NotificationModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    HttpClientModule,
    // SplashModule,
  ],

  providers: [
    { provide: 'API_URL', useValue: environment.apiUrl },
    httpInterceptorProviders,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
