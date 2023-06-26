import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingComponent } from './pending.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('PendingComponent', () => {
  let component: PendingComponent;
  let fixture: ComponentFixture<PendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the PendingComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const messageelement = fixture.nativeElement.querySelector('.section1__hero_title');
    expect(messageelement.textContent).toContain('Verification Pending');
  });
  it('should display the message', () => {
    const messageelement = fixture.nativeElement.querySelector('.section1__title');
    expect(messageelement.textContent).toContain('Thank you for registering! We will review your application soon');
  });

  it('should navigate to the homepage on button click', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    const backbutton = fixture.nativeElement.querySelector('a');
    backbutton.click();
    
    expect(router.navigateByUrl).toHaveBeenCalledWith(jasmine.stringMatching(/\/home/), {
      skipLocationChange: false,
      replaceUrl: false,
      state: undefined
    });
  });
});
