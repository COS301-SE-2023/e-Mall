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
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

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
    brand:'brand1',
    category:'category 1',
  };

  beforeEach(() => {
    // Create a mock ProductService
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getPopProducts', 'getForYouProducts']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        IonicModule,
        AuthModule,
        ProfileModule,
        RouterTestingModule
      ],
      providers: [HomeComponent,{ provide: ProductService, useValue: productServiceSpy }],
    });

    component = TestBed.inject(HomeComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    productServiceMock = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch popular products on initialization', () => {
    // Mock the getPopProducts method of the ProductService to return a mock product list
    productServiceMock.getPopProducts.and.returnValue(of([mockProduct]));

    component.ngOnInit();

    // Ensure that popProducts$ is set correctly with the mock product list
    expect(component.popProducts$).toBeDefined();
    component.popProducts$?.subscribe((products) => {
      expect(products).toEqual([mockProduct]);
    });
  });

  it('should fetch "for you" products on initialization', () => {
    // Mock the getForYouProducts method of the ProductService to return a mock product list
    productServiceMock.getForYouProducts.and.returnValue(of([mockProduct]));

    component.ngOnInit();

    // Ensure that forYouProducts$ is set correctly with the mock product list
    expect(component.forYouProducts$).toBeDefined();
    component.forYouProducts$?.subscribe((products) => {
      expect(products).toEqual([mockProduct]);
    });
  });

 

  it('should return the first image from the list', () => {
    const mockImageList: string[] = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
    const singleImage = component.getOneImg(mockImageList);

    expect(singleImage).toBe('img1.jpg');
  });

  it('should return a default image if the image list is empty', () => {
    const mockImageList: string[] = [];
    const defaultImage = 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    const singleImage = component.getOneImg(mockImageList);

    expect(singleImage).toBe(defaultImage);
  });
});
