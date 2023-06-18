import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignOutComponent } from './sign-out/sign-out.component';

import { RegisterComponent } from './register/register.component';

import { PendingComponent } from './pending/pending.component';
import { httpInterceptorProviders } from './interceptors/index';

import { ReactiveFormsModule } from '@angular/forms';
import { ProductPageComponent } from './product-page/product-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarModule } from './shared/feature/navbar/navbar.module';
import { FooterModule } from './shared/feature/footer/footer.module';
import { ConstructionModule } from './shared/feature/construction/construction.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    SignOutComponent,
    RegisterComponent,
    ProductPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'pending', component: PendingComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
    ]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NavbarModule,
    FooterModule,
    ConstructionModule,
  ],

  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
