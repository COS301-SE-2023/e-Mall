//home unit tests
/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HomeComponent } from '@app/features/home/home.component';
import { IonicModule } from '@ionic/angular';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NgxsModule } from '@ngxs/store';
import { IProduct } from '@shared/models/product/product.interface';
import { ProductService } from '@shared/servicies/product/product.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileService } from '@features/profile/services/profile.service';
import { ComboStateModule } from '@features/combo-state/combo-state.module';
import { NotificationModule } from '@app/features/notification/notification.module';
import { ProductCardFacade } from '@app/shared/components/product-card/services/product-card.facade';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let httpTestingController: HttpTestingController;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  const mockProduct: IProduct = {
    // Define your mock product data here
    // For example:
    id: 1,
    name: 'Mock Product 1',
    min_price: 10.99,
    description: 'This is a mock product',
    brand: 'brand1',
    category: 'category 1',
  };

  beforeEach(() => {
    // Create a mock ProductService
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getPopProducts',
    ]);
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'getSimilarProducts',
    ]); // Add this line

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        IonicModule,
        AuthModule,
        ProfileModule,
        RouterTestingModule,
        ComboStateModule,
        NotificationModule,
      ],
      providers: [
        HomeComponent,
        ProductCardFacade,
        { provide: ProductService, useValue: productServiceSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
      ],
    });

    component = TestBed.inject(HomeComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    productServiceMock = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should return the first image from the list', () => {
    const mockImageList: string[] = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
    const singleImage = component.getOneImg(mockImageList);

    expect(singleImage).toBe('img1.jpg');
  });

  it('should return a default image if the image list is empty', () => {
    const mockImageList: string[] = [];
    const defaultImage = 'assets/images/default.png';

    const singleImage = component.getOneImg(mockImageList);

    expect(singleImage).toBe(defaultImage);
  });
});
