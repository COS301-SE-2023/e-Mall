import { TestBed } from '@angular/core/testing';
import { CategoryBreadcrumbFacade } from '../services/category-breadcrumb.facade';

describe('CategoryBreadcrumbFacade', () => {
  let service: CategoryBreadcrumbFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryBreadcrumbFacade],
    });
    service = TestBed.inject(CategoryBreadcrumbFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return breadcrumbs for a string categoryList', () => {
    const categoryList = 'test';
    const result = service.getBreadcrumbs(categoryList);
    expect(result).toEqual([
      { label: 'Home', url: '/home' },
      { label: 'test', url: '/home' },
    ]);
  });

  it('should return breadcrumbs for an array categoryList', () => {
    const categoryList = ['test1', 'test2'];
    const result = service.getBreadcrumbs(categoryList);
    expect(result).toEqual([
      { label: 'Home', url: '/home' },
      { label: 'test1', url: '/home' },
      { label: 'test2', url: '/home' },
    ]);
  });

  it('should return breadcrumbs for an undefined categoryList', () => {
    const categoryList = undefined;
    const result = service.getBreadcrumbs(categoryList);
    expect(result).toEqual([{ label: 'Home', url: '/home' }]);
  });
});
