import { TestBed } from '@angular/core/testing';

import { CategoryBreadcrumbFacade } from '../services/category-breadcrumb.facade';

describe('CategoryBreadcrumbService', () => {
  let service: CategoryBreadcrumbFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryBreadcrumbFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
