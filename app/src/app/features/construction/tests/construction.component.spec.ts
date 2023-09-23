// construction unit tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConstructionComponent } from '@app/features/construction/construction.component';
import { CommonModule } from '@angular/common';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ConstructionRoutingModule } from '@app/features/construction/construction-routing.module';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { ConstructionModule } from '../construction.module';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NotificationModule } from '@app/features/notification/notification.module';
import { Messaging } from '@angular/fire/messaging';
describe('ConstructionComponent', () => {
  let component: ConstructionComponent;
  let fixture: ComponentFixture<ConstructionComponent>;
  let messagingSpy;
  beforeEach(async () => {
    messagingSpy = jasmine.createSpyObj('Messaging', ['isSupported']);
    messagingSpy.isSupported.and.returnValue(Promise.resolve(true));
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        NgxsModule.forRoot([]),
        ConstructionRoutingModule,
        NavbarModule,
        FooterModule,
        IonicModule,
        ConstructionModule,
        AuthModule,
        ProfileModule,
        NotificationModule,
      ],
      declarations: [ConstructionComponent],
      providers: [
        { provide: Messaging, useValue: messagingSpy },
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
});
