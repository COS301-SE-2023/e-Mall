/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from '../components/sign-in.component';
import { SignInFacade } from '../services/sign-in.facade';
import { LoadingController } from '@ionic/angular';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { SignInModule } from '../sign-in.module';
import { NgxsModule } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let signInFacade: SignInFacade;

  beforeEach(async () => {
    const loadingSpy = jasmine.createSpyObj('loading', ['present', 'dismiss']);
    const loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
      'create',
    ]);
    loadingControllerSpy.create.and.returnValue(Promise.resolve(loadingSpy));

    await TestBed.configureTestingModule({
      imports: [
        SignInModule,
        NgxsModule.forRoot([]),
        HttpClientModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: SignInFacade,
          useValue: jasmine.createSpyObj('SignInFacade', [
            'signIn',
            'getError',
          ]),
        },
        { provide: LoadingController, useValue: loadingControllerSpy },
        {
          provide: ToastComponent,
          useValue: jasmine.createSpyObj('ToastComponent', [
            'presentErrorToast',
          ]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    signInFacade = TestBed.inject(SignInFacade);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call signIn method if form is valid', () => {
      spyOn(component, 'signIn');
      component.signInForm.setValue({
        email: 'test@test.com',
        password: 'password!Q1',
      });
      component.onSubmit();
      expect(component.signIn).toHaveBeenCalled();
    });

    it('should not call signIn method if form is invalid', () => {
      spyOn(component, 'signIn');
      component.signInForm.setValue({ email: '', password: '' });
      component.onSubmit();
      expect(component.signIn).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should call signIn method of signInFacade with email and password', async () => {
      component.signInForm.setValue({
        email: 'test@test.com',
        password: 'password!Q1',
      });
      await component.signIn();
      expect(signInFacade.signIn).toHaveBeenCalledWith(
        'test@test.com',
        'password!Q1'
      );
    });
  });
});
