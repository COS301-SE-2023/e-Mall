/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import 'zone.js/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationModule } from './features/notification/notification.module';
import { NgxsModule } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { AppModule } from './app.module';
import { Messaging } from '@angular/fire/messaging';
import { Firestore } from '@angular/fire/firestore';
describe('AppComponent', () => {
  let messagingSpy;
  beforeEach(async () => {
    messagingSpy = jasmine.createSpyObj('Messaging', ['isSupported']);
    messagingSpy.isSupported.and.returnValue(Promise.resolve(true));
    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule,
        NotificationModule,
        // NgxsModule.forRoot(),
        // HttpClient,
      ],
      providers: [
        { provide: Messaging, useValue: messagingSpy },
        {
          provide: Firestore,
          useValue: { collection: jasmine.createSpy('collection') },
        },
      ],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'e-Mall'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('e-Mall');
  });
});
