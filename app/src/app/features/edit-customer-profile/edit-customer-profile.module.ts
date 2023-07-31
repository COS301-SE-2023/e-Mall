import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCustomerProfileComponent } from './edit-customer-profile.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from '@features/profile/states/profile.state';
import { ProfileService } from '@features/profile/services/profile.service';
import { ProfileFacade } from '@features/profile/services/profile.facade';


@NgModule({
  declarations: [
    EditCustomerProfileComponent
  ],
  imports: [
    CommonModule,
    NavbarModule,
    FooterModule,
    IonicModule,
    CustomerProfileSidenavModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([ProfileState]),

  ],
  providers: [ProfileService, ProfileFacade]
})
export class EditCustomerProfileModule { }
