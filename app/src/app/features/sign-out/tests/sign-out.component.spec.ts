// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/naming-convention */
// import {
//   ComponentFixture,
//   TestBed,
//   fakeAsync,
//   tick,
// } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { SignOutComponent } from '@app/features/sign-out/sign-out.component';
// import { AuthService } from '@app/features/auth/services/auth.service';
// import { Router } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { IonicModule } from '@ionic/angular';
// import { AuthModule } from '@app/features/auth/auth.module';
// import { NgxsModule } from '@ngxs/store';
// import { AuthFacade } from '@app/features/auth/services/auth.facade';

// describe('SignOutComponent', () => {
//   let component: SignOutComponent;
//   let fixture: ComponentFixture<SignOutComponent>;
//   let authService: AuthFacade;
//   let router: Router;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         RouterTestingModule,
//         NgxsModule.forRoot(),
//         HttpClientModule,
//         IonicModule,
//         AuthModule,
//       ],
//       declarations: [SignOutComponent],
//       providers: [],
//     }).compileComponents();

//     router = TestBed.inject(Router);
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SignOutComponent);
//     component = fixture.componentInstance;
//     authService = TestBed.inject(AuthFacade);
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call authService.signOut() on component initialization', fakeAsync(() => {
//     spyOn(authService, 'signOut');
//     component.ngOnInit();
//     // Simulate the passage of time until the countdown reaches zero
//     tick(component.countdown * 5000);
//     expect(authService.signOut).toHaveBeenCalled();
//     component.ngOnDestroy();
//   }));
//   /*
//   it('should redirect to home page after countdown', fakeAsync(() => {
//     component.ngOnInit();
//     tick(1000); // Simulate a 1-second interval
//     tick(1000);
//     tick(1000);
//     tick(1000);
//     tick(1000);
//     expect(router.navigate).toHaveBeenCalledWith(['/home']);
//   }));
// */
//   it('should clear interval on component destruction', () => {
//     spyOn(window, 'clearInterval');
//     component.ngOnDestroy();
//     expect(window.clearInterval).toHaveBeenCalled();
//   });
// });
