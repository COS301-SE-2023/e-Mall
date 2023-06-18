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
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignOutComponent } from './sign-out/sign-out.component';

import { RegisterComponent } from './register/register.component';

import { PendingComponent } from './pending/pending.component';
import { ConstructionComponent } from './construction/construction.component';
import { httpInterceptorProviders } from './interceptors/index';

import { ReactiveFormsModule } from '@angular/forms';
import { ProductPageComponent } from './product-page/product-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    SignOutComponent,
    RegisterComponent,
    ConstructionComponent,
    ProductPageComponent,
    SearchResultsComponent,
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
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'construction', component: ConstructionComponent },
      { path: 'pending', component: PendingComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'search-results', component: SearchResultsComponent },
    ]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],

  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
