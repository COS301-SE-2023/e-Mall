/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SignOutComponent } from './sign-out.component';
import { AuthService } from '@app/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule,],
      declarations: [SignOutComponent],
      providers: [AuthService],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignOutComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.signOut() on component initialization', () => {
    spyOn(authService, 'signOut');
    component.ngOnInit();
    expect(authService.signOut).toHaveBeenCalled();
  });
/*
  it('should redirect to home page after countdown', fakeAsync(() => {
    component.ngOnInit();
    tick(1000); // Simulate a 1-second interval
    tick(1000);
    tick(1000);
    tick(1000);
    tick(1000);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));
*/
  it('should clear interval on component destruction', () => {
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(window.clearInterval).toHaveBeenCalled();
  });
});
