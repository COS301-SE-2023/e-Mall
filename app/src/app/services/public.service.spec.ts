import 'zone.js';
import 'zone.js/testing';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { PublicService } from './public.service';

describe('PublicService', () => {
  let service: PublicService;

  beforeEach(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Add HttpClientModule to the imports array
    });
    service = TestBed.inject(PublicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
