import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthFacade } from './services/auth.facade';
import { AuthService } from './services/auth.service';
import { AuthState } from './states/auth.state';
import { ToastModule } from '@app/shared/components/toast/toast.module';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([AuthState]), ToastModule],
  providers: [AuthService, AuthFacade],
})
export class AuthModule {}
