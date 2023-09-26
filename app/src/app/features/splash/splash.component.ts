import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AuthFacade } from '../auth/services/auth.facade';
import { Router } from '@angular/router';
@Component({
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(1000)),
    ]),
  ],
})
export class SplashComponent {
  logo = 'assets/images/logo.png';
  discover = 'Discover';
  compare = 'Compare';
  shop = 'Shop';
  emall = 'E-mall Has It All!';
  user: string | undefined | null;
  constructor(
    private animationCtrl: AnimationController,
    private authFacade: AuthFacade,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    if (await this.authFacade.isLoggedIn()) {
      this.user = await this.authFacade.getUserType();
    } else {
      this.user = null;
    }

    const bgAnimation = this.animationCtrl
      .create()
      .addElement(document.querySelector('.bg')!)
      .duration(1500)
      .fromTo('opacity', '0', '1');

    const logoAnimation = this.animationCtrl
      .create()
      .addElement(document.querySelector('.logo')!)
      .delay(500)
      .duration(1000)
      .fromTo('opacity', '0', '1');

    const textAnimation = this.animationCtrl
      .create()
      .addElement(document.querySelector('.texts')!)
      // .delay(1000)
      .duration(1000)
      .fromTo('opacity', '0', '1');

    const emallAnimation = this.animationCtrl
      .create()
      .addElement(document.querySelector('.emall-has')!)
      // .delay(1500)
      .duration(1000)
      .fromTo('opacity', '0', '1');

    bgAnimation.play();
    logoAnimation.play().then(() => {
      textAnimation.play().then(() => {
        emallAnimation.play().then(() => {
          setTimeout(() => {
            this.redirectUser();
          }, 1500);
        });
      });
    });
  }

  redirectUser() {
    if (this.user == 'seller') {
      this.router.navigate(['/inventory']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
