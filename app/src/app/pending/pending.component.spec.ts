import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'; // Import BrowserDynamicTestingModule

import { PendingComponent } from './pending.component';

describe('PendingComponent', () => {
  let component: PendingComponent;
  let fixture: ComponentFixture<PendingComponent>;

  beforeEach(async () => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    await TestBed.configureTestingModule({
      declarations: [PendingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
