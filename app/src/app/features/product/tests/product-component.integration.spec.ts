/* eslint-disable @typescript-eslint/no-explicit-any */
//product integration tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductComponent } from '@app/features/product/product.component';
import { ProductService } from '@shared/servicies/product/product.service';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from '../product-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { ProductModule } from '../product.module';

describe('ProductComponentIntegration', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

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
        ProductService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(new Map([['prod_id', '123']])),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // component.ngOnInit();
  });
  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize product, sellers, and currency on ngOnInit', () => {
    spyOn(component['productService'], 'getProductData').and.callThrough();
    spyOn(component['productService'], 'getSellerList').and.callThrough();

    component.prod_id = 123;
    component.ngOnInit();

    expect(component['productService'].getProductData).toHaveBeenCalledWith(
      component.prod_id
    );
    expect(component['productService'].getSellerList).toHaveBeenCalledWith(
      component.prod_id,
      'default'
    );
    expect(component.product$).toBeDefined();
    expect(component.sellers$).toBeDefined();
    expect(component.currency$).toBeDefined();
  });
});
