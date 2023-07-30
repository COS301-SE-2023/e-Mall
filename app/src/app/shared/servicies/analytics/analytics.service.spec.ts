 /* eslint-disable @typescript-eslint/naming-convention */
 
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnalyticsService],
    });
    service = TestBed.inject(AnalyticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAnalyticsData API and return data', () => {
    const seller_name = 'testseller';
    const mockData = { /* mock response data */ };

    service.getAnalyticsData(seller_name).subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/analytics/productanalytics?seller_name=${seller_name}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should call getAllProducts API and return data', () => {
    const seller_name = 'testseller';
    const mockData = { /* mock response data */ };

    service.getAllProducts(seller_name).subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/analytics/allproductanalytics/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ seller_name });
    req.flush(mockData);
  });

  it('should call getConversionRate API and return data', () => {
    const seller_name = 'testseller';
    const mockData = { /* mock response data */ };

    service.getConversionRate(seller_name).subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/analytics/conversionrate?seller_name=${seller_name}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should call getCategoryPercentage API and return data', () => {
    const seller_name = 'testseller';
    const mockData = { /* mock response data */ };

    service.getCategoryPercentage(seller_name).subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/analytics/categorypercentage?seller_name=${seller_name}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should call createAnalyticsData API and handle responses', () => {
    const mockData = { /* mock data to be sent in the request */ };

    service.createAnalyticsData(mockData);

    const req = httpMock.expectOne(`http://localhost:3000/api/analytics/createproductanalytics/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush({ /* mock response data */ });
  });

  it('should call getSelectedProductData API and return data', () => {
    const mockData = { /* mock data to be sent in the request */ };
    const responseData = { /* mock response data */ };

    service.getSelectedProductData(mockData).subscribe((data: any) => {
      expect(data).toEqual(responseData);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/analytics/selectedproducts/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(responseData);
  });
});
