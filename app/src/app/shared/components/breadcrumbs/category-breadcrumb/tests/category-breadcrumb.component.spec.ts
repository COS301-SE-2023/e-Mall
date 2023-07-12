import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBreadcrumbComponent } from '../components/category-breadcrumb.component';

describe('CategoryBreadcrumbComponent', () => {
  let component: CategoryBreadcrumbComponent;
  let fixture: ComponentFixture<CategoryBreadcrumbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryBreadcrumbComponent],
    });
    fixture = TestBed.createComponent(CategoryBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
