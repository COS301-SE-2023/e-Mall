/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
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
      'The page you are looking for might have been removed had its name changed or is temporarily unavailable.';
    expect(errorMessageElement.textContent).toContain(expectedErrorMessage);
  });

  it('should navigate to the homepage on button click', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    const backButton = fixture.nativeElement.querySelector('a');
    backButton.click();
    
    expect(router.navigateByUrl).toHaveBeenCalledWith(jasmine.stringMatching(/\/home/), {
      skipLocationChange: false,
      replaceUrl: false,
      state: undefined
    });
  });
});
