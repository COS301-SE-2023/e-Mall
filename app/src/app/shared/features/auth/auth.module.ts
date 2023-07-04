import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthFacade } from './services/auth.facade';
import { AuthService } from './services/auth.service';
import { AuthState } from './states/auth.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([AuthState])],
  providers: [AuthService, AuthFacade],
})
export class AuthModule {}
