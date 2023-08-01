/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DropdownPopoverComponent } from '@shared/components/dropdown-popover/dropdown-popover.component';
import { Observable, of } from 'rxjs';
import { IProductSeller } from '@shared/models/product/product-seller.interface';

describe('DropdownPopoverComponent', () => {
  let component: DropdownPopoverComponent;
  let fixture: ComponentFixture<DropdownPopoverComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;

  beforeEach(waitForAsync(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const popoverControllerMock = jasmine.createSpyObj('PopoverController', ['dismiss']);

    TestBed.configureTestingModule({
      declarations: [DropdownPopoverComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: PopoverController, useValue: popoverControllerMock }
      ]
    }).compileComponents();

    // We need to inject the Router and PopoverController spies here
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    popoverControllerSpy = TestBed.inject(PopoverController) as jasmine.SpyObj<PopoverController>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the pages array based on parameterData value in ngOnInit', () => {
    
    component.parameterData = 'Cat';

    component.ngOnInit();

    expect(component.pages).toEqual(component.cat_pages);
  });

  it('should dismiss the popover and navigate to the selected page on item click', async () => {
    const pathToNavigate = '/category/Electronics';
    const itemClickSpy = spyOn(component, 'onItemClicked').and.callThrough();
    const nav = '';

    component.parameterData = 'Cat';
    component.ngOnInit();

    await component.onItemClicked(pathToNavigate, nav);

    expect(popoverControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith([pathToNavigate]);
    expect(itemClickSpy).toHaveBeenCalledTimes(1);
    expect(itemClickSpy).toHaveBeenCalledWith(pathToNavigate, nav);
  });
});
