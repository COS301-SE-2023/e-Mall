//home integration test
/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HomeComponent } from '@app/features/home/home.component';
import { Router } from '@angular/router';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NgxsModule } from '@ngxs/store';
import { ElementRef } from '@angular/core';
import { ComboStateModule } from '@features/combo-state/combo-state.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let httpTestingController: HttpTestingController;
  let router: Router;
  
  let mockRecommendedHeading: ElementRef<HTMLElement>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ComboStateModule,
        HttpClientTestingModule,
        AuthModule,
        ProfileModule,
        NgxsModule.forRoot(),
      ],
      providers: [HomeComponent],
    });

    component = TestBed.inject(HomeComponent);
    httpTestingController = TestBed.inject(HttpTestingController);

    router = TestBed.inject(Router);
    
    mockRecommendedHeading = new ElementRef<HTMLElement>(document.createElement('div'));
    component.recommendedHeading = mockRecommendedHeading;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should navigate to search results on search', async () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.search('search query');

    expect(router.navigate).toHaveBeenCalledWith(['/search-results'], {
      queryParams: { search: 'search query' },
    });
  });

  it('should navigate to product page on click', () => {
    const productId = 1;
    spyOn(router, 'navigate');

    component.goToProductPage(productId);

    expect(router.navigate).toHaveBeenCalledWith(['products'], {
      queryParams: { prod_id: productId },
    });
  });

  it('should scroll to recommendedHeading', () => {
    const scrollSpy = spyOn(mockRecommendedHeading.nativeElement, 'scrollIntoView');

    component.onAllClick();

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
  it('should return the first image URL when imgList is provided', () => {
    const imgList = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
    const result = component.getOneImg(imgList);
    expect(result).toEqual('image1.jpg');
  });

  it('should return a default image URL when imgList is not provided or empty', () => {
    const result = component.getOneImg();
    expect(result).toEqual(
      'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg'
    );
  });
});
