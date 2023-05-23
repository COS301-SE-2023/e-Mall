import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'; // Import BrowserDynamicTestingModule

import { ConstructionComponent } from './construction.component';

describe('ConstructionComponent', () => {
  let component: ConstructionComponent;
  let fixture: ComponentFixture<ConstructionComponent>;

  beforeEach(async () => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    await TestBed.configureTestingModule({
      declarations: [ConstructionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
