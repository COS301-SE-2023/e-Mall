import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignOutComponent } from './sign-out/sign-out.component';

import { RegisterComponent } from './register/register.component';

import { PendingComponent } from './pending/pending.component';
import { ConstructionComponent } from './construction/construction.component';

import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    SignOutComponent,
    RegisterComponent,
    ConstructionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'construction', component: ConstructionComponent },
      { path: 'pending', component: PendingComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
    ]),
    ReactiveFormsModule
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
