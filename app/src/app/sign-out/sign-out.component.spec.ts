import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'; // Import BrowserDynamicTestingModule

import { SignOutComponent } from './sign-out.component';

describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;

  beforeEach(async () => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    await TestBed.configureTestingModule({
      declarations: [ SignOutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
