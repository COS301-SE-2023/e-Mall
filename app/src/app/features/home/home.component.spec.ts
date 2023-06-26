/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeComponent]
    });

    component = TestBed.inject(HomeComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the HomeComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should make an API call on page load', () => {
    const mockResponse = { /* mock response data */ };

    component.ngOnInit();

    const req = httpTestingController.expectOne('http://localhost:3000/api/products/backend?search=a');
    expect(req.request.method).toEqual('GET');
    const req2 = httpTestingController.expectOne('http://localhost:3000/api/products/backend?search=f');
    expect(req2.request.method).toEqual('GET');
    req.flush(mockResponse);
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
    it('should return the first image URL when imgList is provided', () => {
      const imgList = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
      const result = component.getOneImg(imgList);
      expect(result).toEqual('image1.jpg');
    });
    
    it('should return a default image URL when imgList is not provided or empty', () => {
      const result = component.getOneImg();
      expect(result).toEqual('https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg');
    });
});