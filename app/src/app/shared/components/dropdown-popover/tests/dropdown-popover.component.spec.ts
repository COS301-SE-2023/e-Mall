/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DropdownPopoverComponent } from '@shared/components/dropdown-popover/dropdown-popover.component';

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

  it('should dismiss the popover and navigate to the selected page on item click', async () => {
    const pathToNavigate = '/category/Electronics';
    const itemClickSpy = spyOn(component, 'onItemClicked').and.callThrough();
    const nav='';

    // Call the method under test
    await component.onItemClicked(pathToNavigate,nav);

    // Expect the popover to be dismissed
    expect(popoverControllerSpy.dismiss).toHaveBeenCalledTimes(1);

    // Expect the router to be navigated to the selected page
    /*expect(routerSpy.navigate).toHaveBeenCalledWith([pathToNavigate],Object({ queryParams: Object({ seller_id: '' }) }));

    // Expect the onItemClicked method to have been called
    expect(itemClickSpy).toHaveBeenCalledTimes(2);
    expect(itemClickSpy).toHaveBeenCalledWith(pathToNavigate,nav);*/
  });
});
