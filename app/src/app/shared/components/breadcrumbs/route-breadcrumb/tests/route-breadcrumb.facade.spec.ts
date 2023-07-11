import { TestBed } from '@angular/core/testing';

import { RouteBreadcrumbFacade } from '../services/route-breadcrumb.facade';

describe('RouteBreadcrumbFacade', () => {
  let service: RouteBreadcrumbFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteBreadcrumbFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
