import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteBreadcrumbComponent } from '../components/route-breadcrumb.component';

describe('route-breadcrumb', () => {
  let component: RouteBreadcrumbComponent;
  let fixture: ComponentFixture<RouteBreadcrumbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteBreadcrumbComponent],
    });
    fixture = TestBed.createComponent(RouteBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
