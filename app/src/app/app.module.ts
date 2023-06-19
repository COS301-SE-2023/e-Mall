import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
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
import { NavbarModule } from './shared/components/navbar/navbar.module';
import { FooterModule } from './shared/components/footer/footer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HomeModule,
    ConstructionModule,
    ProductModule,
    SearchModule,
    SignInModule,
    SellerRegisterModule,
    ConsumerRegisterModule,
    SignOutModule,
    NavbarModule,
    FooterModule,
    NotFoundModule,
    AppRoutingModule,
  ],

  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
