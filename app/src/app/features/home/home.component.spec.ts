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
});