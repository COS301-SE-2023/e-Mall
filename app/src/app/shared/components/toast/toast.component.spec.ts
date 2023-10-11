/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { IError } from '../../../features/error/models/error.interface';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastControllerMock: any;

  beforeEach(waitForAsync(() => {
    const toastElementMock = {
      present: () => Promise.resolve() as Promise<void>,
      header: '',
      message: '',
      duration: 0,
      position: '',
      cssClass: '',
    };

    toastControllerMock = {
      create: () =>
        Promise.resolve(toastElementMock) as Promise<HTMLIonToastElement>,
    };

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      declarations: [ToastComponent],
      providers: [{ provide: ToastController, useValue: toastControllerMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should present error toast when an error is received', async () => {
    const error: IError = {
      code: 500,
      message: 'Internal Server Error',
      name: '',
    };

    spyOn(toastControllerMock, 'create').and.callThrough();

    component.presentErrorToast(of(error));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(toastControllerMock.create).toHaveBeenCalledWith({
      header: 'An error has occurred:',
      message: 'Internal Server Error',
      duration: 3000,
      position: 'bottom',
      cssClass: 'error-toast',
    });
  });

  it('should not present error toast when error is null', async () => {
    spyOn(toastControllerMock, 'create');

    component.presentErrorToast(of(null));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(toastControllerMock.create).not.toHaveBeenCalled();
  });

  /*it('should unsubscribe from the subscription on component destroy', () => {
    const error: IError = {
      code: 500,
      message: 'Internal Server Error',
      name: ''
    };
  
    const errorObservable = of(error);
    const subscription = errorObservable.subscribe();
  
    spyOn(toastControllerMock, 'create').and.callThrough();
  
    component.presentErrorToast(errorObservable);
    component.ngOnDestroy();
  
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
  
  */
});
