/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoryComponent } from '@features/category/category.component';
import { ProductService } from '@shared/servicies/product/product.service';
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
import { Firestore } from '@angular/fire/firestore';
import { Messaging } from '@angular/fire/messaging';
describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  // let productService: jasmine.SpyObj<ProductService>;
  let messagingSpy;
  // let firestore: Firestore;

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
    TestBed.inject(Firestore);

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set a default image URL when imgList is not provided', () => {
    const defaultImgUrl =
      'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    const imageUrl = component.getOneImg();
    expect(imageUrl).toBe(defaultImgUrl);
  });

  it('should return the first image URL when imgList is provided', () => {
    const imgList: string[] = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ];

    const imageUrl = component.getOneImg(imgList);
    expect(imageUrl).toBe(imgList[0]);
  });
});
