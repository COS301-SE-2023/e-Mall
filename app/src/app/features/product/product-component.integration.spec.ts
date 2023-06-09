//product integration tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductComponent } from './product.component';
import { ProductService } from '@app/services/product/product.service';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IProduct } from '@app/models/product/product.interface';
import { IProductSeller } from '@app/models/product/product-seller.interface';

// Mock ProductService
class MockProductService {
  getProductData(): Observable<any> {
    return of({ /* mock product data */ });
  }

  getSellerList(): Observable<any> {
    return of({ /* mock seller list data */ });
  }
}

// Mock Child Component
@Component({
  selector: 'app-some-child-component',
  template: ''
})
class MockChildComponent {
  @Input() prod_id: number | undefined;
}

describe('ProductComponent', () => {
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
        NavbarModule,
        FooterModule,
      ],
      providers: [
        ProductService,
        {
          provide: ActivatedRoute,
          useValue: {
          },
        },
      ],
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize product, sellers, and currency on ngOnInit', () => {
    spyOn(component['productService'], 'getProductData').and.callThrough();
    spyOn(component['productService'], 'getSellerList').and.callThrough();

    component.prod_id = 123; 
    component.ngOnInit();

    expect(component['productService'].getProductData).toHaveBeenCalledWith(123);
    expect(component['productService'].getSellerList).toHaveBeenCalledWith(123, 'default');
    expect(component.product$).toBeDefined();
    expect(component.sellers$).toBeDefined();
    expect(component.currency$).toBeDefined();
  });

  

});
