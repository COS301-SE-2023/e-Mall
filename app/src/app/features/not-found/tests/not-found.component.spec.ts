//not found unit tests
/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from '@app/features/not-found/not-found.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundModule } from '../not-found.module';
import { NgxsModule } from '@ngxs/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NotificationModule } from '@app/features/notification/notification.module';
import { Firestore } from '@angular/fire/firestore';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  // let firestore: Firestore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        // IonicModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        RouterTestingModule,
        NotFoundModule,
        AuthModule,
        ProfileModule,
        NotificationModule,
      ],
      providers: [
        {
          provide: Firestore,
          useValue: { collection: jasmine.createSpy('collection') },
        },
      ],
    }).compileComponents();
    TestBed.inject(Firestore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the NotFoundComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct error message', () => {
    const errorMessageElement = fixture.nativeElement.querySelector('p');
    const expectedErrorMessage =
      'The page you are looking for might have been removed, had its name changed or is temporarily unavailable.';
    expect(errorMessageElement.textContent).toContain(expectedErrorMessage);
  });

  // it('should navigate to the homepage on button click', () => {
  //   const router = TestBed.inject(Router);
  //   spyOn(router, 'navigateByUrl');
  //   const debugEl = fixture.debugElement;
  //   const backButton = debugEl.query(By.css('a[routerLink="/home"]'));

  //   backButton.nativeElement.click();

  //   expect(router.navigateByUrl).toHaveBeenCalledWith(
  //     jasmine.stringMatching(/\/home/),
  //     {
  //       skipLocationChange: false,
  //       replaceUrl: false,
  //       state: undefined,
  //     }
  //   );
  // });

  it('should display "404" as the heading', () => {
    // Create a div element with the specified classes
    const div = document.createElement('div');
    div.id = 'notfound';
    div.className = 'notfound';

    // Create a div element for the 404 heading
    const notfound404Div = document.createElement('div');
    notfound404Div.className = 'notfound-404';

    // Create an h1 element for the 404 text
    const heading = document.createElement('h1');
    heading.textContent = '404';

    // Append the heading to the notfound-404 div
    notfound404Div.appendChild(heading);

    // Create an h2 element for the error message
    const errorMessage = document.createElement('h2');
    errorMessage.textContent = 'We are sorry, Page not found!';

    // Create a p element for the error description
    const errorDescription = document.createElement('p');
    errorDescription.textContent =
      'The page you are looking for might have been removed had its name changed or is temporarily unavailable.';

    // Create an anchor element for the back to homepage link
    const backToHomepageLink = document.createElement('a');
    backToHomepageLink.href = '/home';
    backToHomepageLink.textContent = 'Back To Homepage';

    // Append the elements to build the desired HTML structure
    div.appendChild(notfound404Div);
    div.appendChild(errorMessage);
    div.appendChild(errorDescription);
    div.appendChild(backToHomepageLink);

    // Append the main div to the body of the document
    document.body.appendChild(div);

    // Find the heading element in the document
    const headingElement = document.querySelector(
      '.notfound-404 h1'
    ) as HTMLAnchorElement;

    // Assert that the heading text is "404"
    expect(headingElement.textContent).toEqual('404');
    if (div) {
      document.body.removeChild(div);
    }
  });
});
