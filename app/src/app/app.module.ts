import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from '@app/shared/interceptors/index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarModule } from '@app/shared/components/navbar/navbar.module';
import { FooterModule } from '@app/shared/components/footer/footer.module';
import { ConstructionModule } from '@app/features/construction/construction.module';
import { NotFoundModule } from '@app/features/not-found/not-found.module';
import { HomeModule } from './features/home/home.module';
import { PendingModule } from './features/pending/pending.module';
import { ProductModule } from './features/product/product.module';
import { SearchModule } from './features/search/search.module';

// import { ViewSizeDirective } from './shared/directives/view-size.directive';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    // SignInComponent,
    // SignUpComponent,
    // RegisterComponent,
    // ProductComponent,
    // SearchComponent,
    // ViewSizeDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // NavbarModule,
    // FooterModule,
    ConstructionModule,
    NotFoundModule,
    HomeModule,
    ProductModule,
    SearchModule,
  ],

  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
