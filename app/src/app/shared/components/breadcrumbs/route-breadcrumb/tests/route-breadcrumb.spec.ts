import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteBreadcrumbComponent } from '../components/route-breadcrumb.component';
import { RouteBreadcrumbFacade } from '../services/route-breadcrumb.facade';

describe('RouteBreadcrumbComponent', () => {
  let component: RouteBreadcrumbComponent;
  let fixture: ComponentFixture<RouteBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RouteBreadcrumbComponent],
      providers: [
        {
          provide: RouteBreadcrumbFacade,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
