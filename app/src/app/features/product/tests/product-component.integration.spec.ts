/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
//product integration tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from '@app/features/product/product.component';
import { ProductService } from '@shared/servicies/product/product.service';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from '../product-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { ProductModule } from '../product.module';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { AuthModule } from '../../auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';

describe('ProductComponentIntegration', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  // eslint-disable-next-line prefer-const
  let mockProductService = jasmine.createSpyObj('ProductService', [
    'getProductData',
    'getSellerList',
  ]);
  const mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', [
    'createAnalyticsData',
  ]);
  const mockActivatedRoute = {
    queryParamMap: of({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: (key: string) => '1', // Assuming 'prod_id' query parameter is set to 1
    } as ParamMap),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        ProductRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule,
        MatSelectModule,
        MatExpansionModule,
        NgxsModule.forRoot([]),
        NavbarModule,
        FooterModule,
        IonicModule,
        ProductModule,
        AuthModule,
        ProfileModule,
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
