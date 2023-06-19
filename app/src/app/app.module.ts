import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from '@app/features/home/home.component';
// import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from '@app/features/sign-up/sign-up.component';
// import { SignOutComponent } from './sign-out/sign-out.component';

import { RegisterComponent } from '@app/features/register/register.component';

import { PendingComponent } from '@app/features/pending/pending.component';
import { httpInterceptorProviders } from '@app/shared/interceptors/index';

import { ReactiveFormsModule } from '@angular/forms';
import { ProductPageComponent } from '@app/features/product-page/product-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarModule } from '@app/shared/components/navbar/navbar.module';
import { FooterModule } from '@app/shared/components/footer/footer.module';
import { ConstructionModule } from '@app/features/construction/construction.module';
import { SearchResultsComponent } from '@app/features/search-results/search-results.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NotFoundModule } from '@app/features/not-found/not-found.module';
import { HomeModule } from './features/home/home.module';

// import { ViewSizeDirective } from './shared/directives/view-size.directive';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    // SignInComponent,
    SignUpComponent,
    RegisterComponent,
    ProductPageComponent,
    SearchResultsComponent,
    // ViewSizeDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    NavbarModule,
    FooterModule,
    ConstructionModule,
    NotFoundModule,
    HomeModule,
  ],

  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
