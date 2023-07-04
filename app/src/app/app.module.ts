import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from '@app/shared/interceptors/index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './features/home/home.module';
import { ConstructionModule } from './features/construction/construction.module';
import { ProductModule } from './features/product/product.module';
import { NotFoundModule } from './features/not-found/not-found.module';
import { SearchModule } from './features/search/search.module';
import { SignInModule } from './features/sign-in/sign-in.module';
import { SellerRegisterModule } from './features/sign-up/seller/seller-register.module';
import { ConsumerRegisterModule } from './features/sign-up/consumer/consumer-register.module';
import { SignOutModule } from './features/sign-out/sign-out.module';
import { FooterModule } from './shared/components/footer/footer.module';
import { ContactModule } from './features/contact/contact.module';
import { AboutModule } from './features/about/about.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
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
import { AuthModule } from './services/auth/auth.module';
import { ErrorModule } from './shared/error/error.module';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IonicModule.forRoot(),
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
    HomeModule,
    ProductModule,
    SignInModule,
    SellerRegisterModule,
    ConsumerRegisterModule,
    SignOutModule,
    FooterModule,
    NavbarModule,
    AboutModule,
    MatTooltipModule,
  ],

  providers: [
    { provide: 'API_URL', useValue: environment.apiUrl },
    httpInterceptorProviders,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
