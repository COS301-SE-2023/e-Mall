/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryBreadcrumbModule } from '../category-breadcrumb.module';
import { CategoryBreadcrumbComponent } from '../components/category-breadcrumb.component';
import { CategoryBreadcrumbFacade } from '../services/category-breadcrumb.facade';
import { RouterTestingModule } from '@angular/router/testing';

describe('CategoryBreadcrumbComponent', () => {
  let component: CategoryBreadcrumbComponent;
  let fixture: ComponentFixture<CategoryBreadcrumbComponent>;
  let categoryBreadcrumbFacade: CategoryBreadcrumbFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryBreadcrumbComponent],
      imports: [CategoryBreadcrumbModule, RouterTestingModule],
      providers: [CategoryBreadcrumbFacade],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryBreadcrumbComponent);
    component = fixture.componentInstance;
    categoryBreadcrumbFacade = TestBed.inject(CategoryBreadcrumbFacade);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getBreadcrumbs on ngOnInit', () => {
    const spy = spyOn(categoryBreadcrumbFacade, 'getBreadcrumbs');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
