import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  constructor(
    private router: Router,
  ) {
    
  }
  async onAllClick() {
    this.router.navigate(['home']);
  }
}
