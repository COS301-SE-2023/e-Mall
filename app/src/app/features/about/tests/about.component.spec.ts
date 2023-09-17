// about unit tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from '@app/features/about/about.component';
import { CommonModule } from '@angular/common';
import { AboutRoutingModule } from '@app/features/about/about-routing.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { AboutModule } from '../about.module';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { NotificationModule } from '@app/features/notification/notification.module';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        NgxsModule.forRoot([]),
        AboutRoutingModule,
        NavbarModule,
        FooterModule,
        IonicModule,
        AuthModule,
        ProfileModule,
        AboutModule,
        NotificationModule,
      ],
      declarations: [AboutComponent],
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
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AboutComponent', () => {
    expect(component).toBeTruthy();
  });

  //Unit Test
  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    const titleelement = compiled.querySelector('h2');
    expect(titleelement.textContent).toContain('About Us');
  });

  //Unit Test
  it('should display the correct description', () => {
    const compiled = fixture.nativeElement;
    const descrelement = compiled.querySelector('.text p');
    const expecteddescr =
      'E-mall is an online platform that allows verified sellers to list their products and enables customers to easily view and compare similar products across multiple websites.';
    expect(descrelement.textContent).toContain(expecteddescr);
  });
});
