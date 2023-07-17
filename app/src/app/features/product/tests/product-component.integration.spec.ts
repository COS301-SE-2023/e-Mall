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
import { ActivatedRoute, Router,ParamMap } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IProduct } from '@shared/models/product/product.interface';
import { of } from 'rxjs';
import { IProductSeller } from '@shared/models/product/product-seller.interface';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { ProductModule } from '../product.module';
describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: ProductService;
  let router: Router;
  // eslint-disable-next-line prefer-const
  let mockProductService = jasmine.createSpyObj('ProductService', ['getProductData', 'getSellerList']);
  const mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', ['createAnalyticsData']);
  const mockActivatedRoute = {
    queryParamMap: of({
      get: (key: string) => '1' // Assuming 'prod_id' query parameter is set to 1
    } as ParamMap)
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
      ],
      providers: [
          { provide: ProductService, useValue: mockProductService },
          { provide: AnalyticsService, useValue: mockAnalyticsService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
        
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });
  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
