import { Component } from '@angular/core';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-customer-profile',
  templateUrl: './edit-customer-profile.component.html',
  styleUrls: ['./edit-customer-profile.component.scss'],
})
export class EditCustomerProfileComponent {
  customerprofileForm: FormGroup;
  isChanged = false;
  // editProfileForm: FormGroup;
  profile$: Observable<ISellerProfile | IConsumerProfile | null>;

  constructor(
    public profileFacade: ProfileFacade,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.customerprofileForm = this.formBuilder.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.pattern(/^\d{4}$/)], 
    });

    this.profile$ = this.profileFacade.getProfile();
  }
  ionViewWillEnter() {
    this.profile$.subscribe(profile => {
      if (profile) {
        this.customerprofileForm.patchValue({
          username: profile.username,
          first_name: profile.details.first_name,
          last_name: profile.details.last_name,
          phone_number: profile.details.phone_number,
          address: profile.details.address,
          city: profile.details.city,
          postal_code: profile.details.postal_code,
        });
      }
    });
  }

  onSubmit() {
    this.profileFacade.updateProfile({
      username: this.customerprofileForm.value.username,
      details: {
        first_name: this.customerprofileForm.value.first_name,
        last_name: this.customerprofileForm.value.last_name,
        phone_number: this.customerprofileForm.value.phone_number,
        address: this.customerprofileForm.value.address,
        city: this.customerprofileForm.value.city,
        postal_code: this.customerprofileForm.value.postal_code,
      },
    });
    this.router.navigate(['/customer-profile']);
  }

  onChange() {
    this.isChanged = true;
  }
}
