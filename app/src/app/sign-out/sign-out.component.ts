import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss'],
})
export class SignOutComponent implements OnInit, OnDestroy {
  countdown: number;
  intervalId: any;
  constructor(private router: Router, private authService: AuthService) {
    this.countdown = 5;
    // this.user = {} as ISellerForm;
  }
  ngOnInit(): void {
    this.signOut();
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.router.navigate(['/home']);
      }
    }, 1000);
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  signOut() {
    this.authService.signOut();
  }
}
