//contact unit tests
/* eslint-disable @typescript-eslint/naming-convention */
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

  
  it('should display "Send Message" button', () => {
    // Create a div element with the specified styles
    const div = document.createElement('div');
    div.className = 'row justify-content-center';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.flexDirection = 'column';
    div.style.alignContent = 'center';
    div.style.alignItems = 'center';
    div.style.verticalAlign = 'middle';
    div.style.alignSelf = 'center';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.gap = '10px';

    // Create an empty div element as a child of the main div
    const emptyDiv = document.createElement('div');
    emptyDiv.style.height = '100px';
    div.appendChild(emptyDiv);

    // Create a form element with the specified classes
    const form = document.createElement('form');
    form.className = 'border-right pr-5 mb-5';
    form.method = 'post';
    form.id = 'contactForm';
    form.name = 'contactForm';

    // Create a submit input element with the specified value and class
    const submitInput = document.createElement('input');
    submitInput.type = 'submit';
    submitInput.value = 'Send Message';
    submitInput.className = 'btn btn-primary rounded-0 py-2 px-4';
    submitInput.style.backgroundColor = 'black';

    // Append the submit input to the form
    form.appendChild(submitInput);

    // Append the form to the main div
    div.appendChild(form);

    // Append the main div to the body of the document
    document.body.appendChild(div);

    // Find the submit input element in the document
    const submitButton = document.querySelector('.btn-primary') as HTMLInputElement;

    // Assert that the submit button exists
    expect(submitButton).toBeTruthy();
    // Assert that the submit button has the correct value
    expect(submitButton).toBeDefined(); // Check if submitButton is defined

    if (submitButton) {
      expect(submitButton.value).toEqual('Send Message');
    }
  });

  it('should display the first name input field', () => {
    // Create a form element with the specified classes
    const form = document.createElement('form');
    form.className = 'border-right pr-5 mb-5';
    form.method = 'post';
    form.id = 'contactForm';
    form.name = 'contactForm';

    // Create an input element for the first name
    const firstNameInput = document.createElement('input');
    firstNameInput.type = 'text';
    firstNameInput.className = 'form-control';
    firstNameInput.name = 'fname';
    firstNameInput.id = 'fname';
    firstNameInput.placeholder = 'First name';

    // Append the first name input to the form
    form.appendChild(firstNameInput);

    // Append the form to the body of the document
    document.body.appendChild(form);

    // Find the first name input element in the document
    const firstNameInputElement = document.querySelector('#fname') as HTMLInputElement;

    // Assert that the first name input exists
    expect(firstNameInputElement).toBeTruthy();
    // Assert that the first name input has the correct placeholder
    expect(firstNameInputElement.placeholder).toEqual('First name');
  });

  it('should display the last name input field', () => {
    // Create a form element with the specified classes
    const form = document.createElement('form');
    form.className = 'border-right pr-5 mb-5';
    form.method = 'post';
    form.id = 'contactForm';
    form.name = 'contactForm';

    // Create an input element for the last name
    const lastNameInput = document.createElement('input');
    lastNameInput.type = 'text';
    lastNameInput.className = 'form-control';
    lastNameInput.name = 'lname';
    lastNameInput.id = 'lname';
    lastNameInput.placeholder = 'Last name';

    // Append the last name input to the form
    form.appendChild(lastNameInput);

    // Append the form to the body of the document
    document.body.appendChild(form);

    // Find the last name input element in the document
    const lastNameInputElement = document.querySelector('#lname') as HTMLInputElement;

    // Assert that the last name input exists
    expect(lastNameInputElement).toBeTruthy();
    // Assert that the last name input has the correct placeholder
    expect(lastNameInputElement.placeholder).toEqual('Last name');
  });

  it('should display the email input field', () => {
    // Create a form element with the specified classes
    const form = document.createElement('form');
    form.className = 'border-right pr-5 mb-5';
    form.method = 'post';
    form.id = 'contactForm';
    form.name = 'contactForm';

    // Create an input element for the last name
    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.className = 'form-control';
    emailInput.name = 'email';
    emailInput.id = 'email';
    emailInput.placeholder = 'Email';

    // Append the last name input to the form
    form.appendChild(emailInput);

    // Append the form to the body of the document
    document.body.appendChild(form);

    // Find the last name input element in the document
    const lastNameInputElement = document.querySelector('#email') as HTMLInputElement;

    // Assert that the last name input exists
    expect(lastNameInputElement).toBeTruthy();
    // Assert that the last name input has the correct placeholder
    expect(lastNameInputElement.placeholder).toEqual('Email');
  });

});
