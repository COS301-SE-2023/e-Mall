import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CognitoService } from '@app/services/cognito.service';
import { PublicService } from './services/public.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Angular 15.2.9 and DRF (AUTH SYSTEM EXAMPLE)';
  msg: string | undefined;
  isAuthenticated: boolean;

  constructor(
    private pService: PublicService,
    private router: Router,
    private cognitoService: CognitoService
  ) {
    this.isAuthenticated = false;
  }
  public ngOnInit(): void {
    this.showMessage();
    this.cognitoService
      .isAuthenticated()
      .then((success: boolean) => {
        this.isAuthenticated = success;
      })
      .catch((error: any) => {
        // Handle any errors that occurred during the promise execution
        console.error(error);
      });
  }

  showMessage() {
    this.pService.getMessages().subscribe(data => {
      this.msg = data.toString();
      console.log(this.msg);
    });
  }
  public signOut(): void {
    this.cognitoService
      .signOut()
      .then(() => {
        this.router.navigate(['/signIn']);
      })
      .catch((error: any) => {
        // Handle any errors that occurred during the promise execution
        console.error(error);
      });
  }
}
