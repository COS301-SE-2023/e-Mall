import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConstructionComponent } from './construction.component';

import { CommonModule } from '@angular/common';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ConstructionRoutingModule } from './construction-routing.module';

import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('ConstructionComponent', () => {
  let component: ConstructionComponent;
  let fixture: ComponentFixture<ConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        ConstructionRoutingModule,
        NavbarModule,
        FooterModule,
      ],
      declarations: [ConstructionComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            /* Mock or stub properties/methods you need here */
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ConstructionComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct heading', () => {
    const compiled = fixture.nativeElement;
    const headingel = compiled.querySelector('h1');
    expect(headingel.textContent).toContain('Coming Soon');
  });

  // Add more test cases as needed

});
