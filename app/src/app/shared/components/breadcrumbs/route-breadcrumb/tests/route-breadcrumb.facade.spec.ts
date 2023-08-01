import { TestBed } from '@angular/core/testing';
import { RouteBreadcrumbFacade } from '../services/route-breadcrumb.facade';

describe('RouteBreadcrumbFacade', () => {
  let service: RouteBreadcrumbFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteBreadcrumbFacade],
    });
    service = TestBed.inject(RouteBreadcrumbFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return breadcrumbs for a routerState with a url', () => {
    const routerState = { url: '/test1/test2' };
    const result = service.getBreadcrumbs(routerState);
    expect(result).toEqual([
      { label: 'Home', url: '/home' },
      { label: 'Test1', url: '/test1' },
      { label: 'Test2', url: '/test1/test2' },
    ]);
  });

  it('should return breadcrumbs for a routerState without a url', () => {
    const routerState = {};
    const result = service.getBreadcrumbs(routerState);
    expect(result).toEqual([]);
  });
});
