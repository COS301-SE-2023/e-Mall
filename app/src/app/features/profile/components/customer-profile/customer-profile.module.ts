import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerProfileComponent } from './customer-profile.component';
import { IonicModule } from '@ionic/angular';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from '@features/profile/states/profile.state';
import { ProfileService } from '@features/profile/services/profile.service';
import { ProfileFacade } from '@features/profile/services/profile.facade';



@NgModule({
  declarations: [
    CustomerProfileComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    NavbarModule,
    IonicModule,
    CustomerProfileSidenavModule,
    NgxsModule.forFeature([ProfileState]),

  ],
  providers: [ProfileService, ProfileFacade]
})
export class CustomerProfileModule { }
