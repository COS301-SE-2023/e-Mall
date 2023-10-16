import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ProductCardModule } from '../../shared/components/product-card/product-card.module';
import { ProfileModule } from '@features/profile/profile.module';
import { ComboStateModule } from '@features/combo-state/combo-state.module';

// const routes: Routes = [
//   { path: '', pathMatch: 'full', component: HomeComponent },
// ];

@NgModule({
  declarations: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // providers: [ProductService, AuthService],
  // exports: [RouterModule],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    NgbCarouselModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    IonicModule,
    NavbarModule,
    FooterModule,
    ProductCardModule,
    ProfileModule,
    ComboStateModule,
    // RouterModule.forChild(routes),
  ],
})
export class HomeModule {}
