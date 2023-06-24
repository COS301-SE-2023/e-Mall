import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';

import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { NavbarModule } from '../../shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';

import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule,CommonModule, ContactRoutingModule, NavbarModule, FooterModule],
      declarations: [ContactComponent], 
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
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ContactComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct heading', () => {
    const compiled = fixture.nativeElement;
    const headingel = compiled.querySelector('h2');
    expect(headingel.textContent).toContain('Fill the form.');
  });

  // Add more test cases as needed

});
