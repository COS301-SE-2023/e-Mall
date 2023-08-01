import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInRoutingModule } from './sign-in-routing.module';
import { SignInComponent } from './components/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignInFacade } from './services/sign-in.facade';
import { ViewSizeModule } from '@shared/directives/view-size/view-size.module';
import { ToastModule } from '@shared/components/toast/toast.module';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    SignInRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ViewSizeModule,
    ToastModule,
  ],
  exports: [SignInComponent],
  providers: [SignInFacade],
})
export class SignInModule {}
