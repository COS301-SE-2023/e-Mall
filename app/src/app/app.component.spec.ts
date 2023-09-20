import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import 'zone.js/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationModule } from './features/notification/notification.module';
import { NgxsModule } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule,
        NotificationModule,
        // NgxsModule.forRoot(),
        // HttpClient,
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
