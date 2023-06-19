import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { RegisterComponent } from './register/register.component';

import { PendingComponent } from './pending/pending.component';
import { ConstructionComponent } from './construction/construction.component';
import { SignOutComponent } from './sign-out/sign-out.component';

const routes: Routes = [
  // {
  //   path: '**',
  //   redirectTo: 'signIn',
  // },
  { path: 'home', component: HomeComponent },
  { path: 'construction', component: ConstructionComponent },
  { path: 'pending', component: PendingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sign-in', component: SignInComponent },

  { path: 'sign-up', component: SignUpComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
