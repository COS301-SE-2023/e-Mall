import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthFacade } from './auth.facade';
import { AuthService } from './service/auth.service';
import { AuthState } from './state/auth.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([AuthState])],
  providers: [AuthService, AuthFacade],
})
export class AuthModule {}
