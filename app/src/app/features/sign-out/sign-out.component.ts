/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '@shared/features/auth/services/auth.facade';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss'],
})
export class SignOutComponent implements OnInit, OnDestroy {
  countdown: number;
  intervalId: any;
  constructor(private router: Router, private authFacade: AuthFacade) {
    this.countdown = 5;
    // this.user = {} as ISellerForm;
  }
  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.signOut();
      }
    }, 1000);
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  signOut() {
    this.authFacade.signOut();
  }
}
