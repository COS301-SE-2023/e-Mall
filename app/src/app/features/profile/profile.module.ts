import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from './states/profile.state';
import { ProfileService } from './services/profile.service';
import { ProfileFacade } from './services/profile.facade';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    NgxsModule.forFeature([ProfileState]),
    ProfileRoutingModule,
  ],
  exports: [ProfileComponent],
  providers: [ProfileService, ProfileFacade],
})
export class ProfileModule {}
