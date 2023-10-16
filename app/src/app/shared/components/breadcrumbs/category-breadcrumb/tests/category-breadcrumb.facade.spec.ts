import { TestBed } from '@angular/core/testing';
import { CategoryBreadcrumbFacade } from '../services/category-breadcrumb.facade';
import { ActivatedRoute } from '@angular/router';

describe('CategoryBreadcrumbFacade', () => {
  let service: CategoryBreadcrumbFacade;
  // let activated_route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryBreadcrumbFacade,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'test', // Replace with your desired route parameter value
              },
            },
          },
        },
      ],
    });

    service = TestBed.inject(CategoryBreadcrumbFacade);
    TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return breadcrumbs for a string categoryList', () => {
    const categoryList = 'test';
    const result = service.getBreadcrumbs(categoryList);
    expect(result).toEqual([
      { label: 'Home', url: '/home' },
      { label: 'test', url: '/category/test' },
    ]);
  });

  it('should return breadcrumbs for an array categoryList', () => {
    const categoryList = 'test1';
    const result = service.getBreadcrumbs(categoryList);
    expect(result).toEqual([
      { label: 'Home', url: '/home' },
      { label: 'test1', url: '/category/test1' },
    ]);
  });

  it('should return breadcrumbs for an undefined categoryList', () => {
    const categoryList = undefined;
    const result = service.getBreadcrumbs(categoryList);
    expect(result).toEqual([{ label: 'Home', url: '/home' }]);
  });
});
