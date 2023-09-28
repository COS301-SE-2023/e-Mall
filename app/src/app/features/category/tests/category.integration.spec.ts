/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CategoryComponent } from '@features/category/category.component';
import { ProductService } from '@shared/servicies/product/product.service';
import { IProduct } from '@shared/models/product/product.interface';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { FooterModule } from '@shared/components/footer/footer.module';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { ProductCardModule } from '@shared/components/product-card/product-card.module';
import { NotificationModule } from '@app/features/notification/notification.module';
import { CategoryBreadcrumbModule } from '@app/shared/components/breadcrumbs/category-breadcrumb/category-breadcrumb.module';
import { Messaging } from '@angular/fire/messaging';
import { Firestore } from '@angular/fire/firestore';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let messagingSpy;
  let firestore: Firestore;

  beforeEach(() => {
    messagingSpy = jasmine.createSpyObj('Messaging', ['isSupported']);
    messagingSpy.isSupported.and.returnValue(Promise.resolve(true));
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getCategoryProducts',
    ]);

    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        NgxsModule.forRoot([]),
        NavbarModule,
        FooterModule,
        ProductCardModule,
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
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
        MatRadioModule,
        AuthModule,
        ProfileModule,
        NotificationModule,
        CategoryBreadcrumbModule,
      ],
      declarations: [CategoryComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Messaging, useValue: messagingSpy },
        {
          provide: Firestore,
          useValue: { collection: jasmine.createSpy('collection') },
        },
      ],
    }).compileComponents();
    firestore = TestBed.inject(Firestore);

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch category products on component initialization', () => {
    // const categoryName = 'Electronics';
    const categoryProducts: IProduct[] = [
      {
        id: 131,
        min_price_original_price: 499.0,
        min_price_discount: 180.0,
        min_price_discount_rate: 0.36,
        min_price: 319.0,
        min_price_seller_id: '93802b0f-06a7-413a-bbb0-073cb43e6e9c',
        min_price_seller_product_url:
          'https://www.takealot.com/tp-link-300mbps-wireless-n-wall-range-extender-no-ethernet-port/PLID38533224',
        min_price_seller_business_name: 'Takealot',
        min_price_in_stock: true,
        min_price_img_array: [
          'https://media.takealot.com/covers_tsins/41259431/6935364071325--zoom.jpg',
          'https://media.takealot.com/covers_tsins/41259431/6935364071325-1-zoom.jpg',
          'https://media.takealot.com/covers_tsins/41259431/6935364071325-2-zoom.jpg',
        ],
        name: 'Tp-link  Universal Wi-Fi Range Extender',
        description:
          'Range Extender mode boosts wireless signal to previously unreachable or hard-to-wire areas flawlessly.Miniature size and wall-mounted design make it easy to deploy and move flexibly',
        brand: 'Tp-link',
        category: 'electronics',
        created_at: '2023-07-17T07:37:35.076332Z',
        updated_at: '2023-07-17T07:37:35.076359Z',
      },
      {
        id: 131,
        min_price_original_price: 499.0,
        min_price_discount: 180.0,
        min_price_discount_rate: 0.36,
        min_price: 319.0,
        min_price_seller_id: '93802b0f-06a7-413a-bbb0-073cb43e6e9c',
        min_price_seller_product_url:
          'https://www.takealot.com/tp-link-300mbps-wireless-n-wall-range-extender-no-ethernet-port/PLID38533224',
        min_price_seller_business_name: 'Takealot',
        min_price_in_stock: true,
        min_price_img_array: [
          'https://media.takealot.com/covers_tsins/41259431/6935364071325--zoom.jpg',
          'https://media.takealot.com/covers_tsins/41259431/6935364071325-1-zoom.jpg',
          'https://media.takealot.com/covers_tsins/41259431/6935364071325-2-zoom.jpg',
        ],
        name: 'Tp-link  Universal Wi-Fi Range Extender',
        description:
          'Range Extender mode boosts wireless signal to previously unreachable or hard-to-wire areas flawlessly.Miniature size and wall-mounted design make it easy to deploy and move flexibly',
        brand: 'Tp-link',
        category: 'electronics',
        created_at: '2023-07-17T07:37:35.076332Z',
        updated_at: '2023-07-17T07:37:35.076359Z',
      },
    ];

    productService.getCategoryProducts.and.returnValue(of(categoryProducts));
    component.ngOnInit();

    expect(component.categoryProducts$).toBeDefined();
  });

  it('should navigate to the product page with the correct prod_id', () => {
    const prod_id = 123; // Replace with your test prod_id value

    spyOn((component as any).router, 'navigate'); // Accessing private router property

    component.goToProductPage(prod_id);

    expect((component as any).router.navigate).toHaveBeenCalledWith(
      ['products'],
      {
        queryParams: { prod_id: prod_id },
      }
    );
  });
});
