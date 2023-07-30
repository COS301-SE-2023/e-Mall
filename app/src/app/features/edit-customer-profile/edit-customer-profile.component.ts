import { Component, OnInit } from '@angular/core';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-customer-profile',
  templateUrl: './edit-customer-profile.component.html',
  styleUrls: ['./edit-customer-profile.component.scss'],
})
export class EditCustomerProfileComponent implements OnInit {
  customerprofileForm: FormGroup;
  // editProfileForm: FormGroup;
  profile$: Observable<ISellerProfile | IConsumerProfile | null>;

  constructor(
    public profileFacade: ProfileFacade,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.customerprofileForm = new FormGroup({
      username: new FormControl(),
    });

    this.profile$ = this.profileFacade.getProfile();
  }

  ngOnInit() {
    //this.profile$ = this.profileFacade.getProfile();

    this.profile$.subscribe(profile => {
      if (profile) {
        this.customerprofileForm.patchValue({
          username: profile.username,
        });
      }
    });
  }

  onSubmit() {
    this.profileFacade.updateProfile({
      username: this.customerprofileForm.value.username,
    });
    this.router.navigate(['/customer-profile']);
  }
}
