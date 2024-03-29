//pending unit tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingComponent } from '@app/features/pending/pending.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

describe('PendingComponent', () => {
  let component: PendingComponent;
  let fixture: ComponentFixture<PendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingComponent],
      imports: [RouterTestingModule, IonicModule],
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
    const messageelement = fixture.nativeElement.querySelector('h1');
    expect(messageelement.textContent).toContain('Verification Pending');
  });
  it('should display the message', () => {
    const messageelement = fixture.nativeElement.querySelector('h2');
    expect(messageelement.textContent).toContain(
      'Thank you for registering! We will review your application soon'
    );
  });
  /*
  it('should navigate to the homepage on button click', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    const backbutton = fixture.nativeElement.querySelector('a');
    backbutton.click();

    expect(router.navigateByUrl).toHaveBeenCalledWith(
      /sign-out,
      {
        skipLocationChange: false,
        replaceUrl: false,
        state: undefined,
      }
    );
  });*/
});
