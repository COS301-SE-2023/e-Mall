/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { ConsumerFacade } from '../services/consumer.facade';
import { ConsumerRegisterComponent } from '../components/consumer-register.component';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { IConsumerForm } from '../models/consumer.interface';
describe('ConsumerModule', () => {
  let component: ConsumerRegisterComponent;
  let fixture: ComponentFixture<ConsumerRegisterComponent>;
  let consumerFacade: ConsumerFacade;
  let loadingController: LoadingController;
  let toast: ToastComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumerRegisterComponent],
      imports: [ReactiveFormsModule, IonicModule],
      providers: [
        {
          provide: ConsumerFacade,
          useValue: jasmine.createSpyObj('ConsumerFacade', [
            'signUp',
            'getError',
          ]),
        },
        {
          provide: LoadingController,
          useValue: jasmine.createSpyObj('LoadingController', ['create']),
        },
        {
          provide: ToastComponent,
          useValue: jasmine.createSpyObj('ToastComponent', [
            'presentErrorToast',
          ]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerRegisterComponent);
    component = fixture.componentInstance;
    consumerFacade = TestBed.inject(ConsumerFacade);
    loadingController = TestBed.inject(LoadingController);
    toast = TestBed.inject(ToastComponent);

    // Mock the LoadingController.create method
    (loadingController.create as jasmine.Spy).and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        dismiss: () => Promise.resolve(),
      })
    );
  });

  describe('ConsumerRegisterComponent', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should sign up a consumer', async () => {
      component.registerForm.setValue({
        email: 'test@example.com',
        password: 'testpassword',
        cpassword: 'testpassword',
      });
      await component.signUp();
      const form: IConsumerForm = {
        email: 'test@example.com',
        password: 'testpassword',
        type: 'consumer',
      };
      expect(consumerFacade.signUp).toHaveBeenCalledWith(form);
    });
  });

  describe('ConsumerFacade', () => {
    it('should sign up a consumer Facade', async () => {
      const form: IConsumerForm = {
        email: 'test@example.com',
        password: 'testpassword',
        type: 'consumer',
      };
      await consumerFacade.signUp(form);
      expect(consumerFacade.signUp).toHaveBeenCalledWith(form);
    });
  });
});
