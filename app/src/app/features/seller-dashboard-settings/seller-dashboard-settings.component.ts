import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-seller-dashboard-settings',
  templateUrl: './seller-dashboard-settings.component.html',
  styleUrls: ['./seller-dashboard-settings.component.scss']
})
export class SellerDashboardSettingsComponent implements OnInit{

  @ViewChild(IonContent)
  content!: IonContent;
  
  sellerProfileForm: FormGroup;
  isUsernameChanged = false;
  profile$: Observable<ISellerProfile | IConsumerProfile | null>;

  constructor(
    public profileFacade: ProfileFacade,
    private formBuilder: FormBuilder,
    private router: Router
  ) 
  {
    this.sellerProfileForm = new FormGroup({
      username: new FormControl(),
      name: new FormControl(),
      email: new FormControl(),
      phoneNumber: new FormControl(),
      street: new FormControl(),
      postcode: new FormControl(),
      website: new FormControl(),
      facebook: new FormControl(),
      instagram: new FormControl(),
      twitter: new FormControl(),

      
    });

    this.profile$ = this.profileFacade.getProfile();
  }



  ngOnInit() {
    //this.profile$ = this.profileFacade.getProfile();

    this.profile$.subscribe(profile => {
      if (profile) {
        this.sellerProfileForm.patchValue({
          username: profile.username,
        });
      }
    });
  }

  onSubmit() {
    this.profileFacade.updateProfile({
      username: this.sellerProfileForm.value.username,
    });
    this.router.navigate(['/customer-profile']);
  }

  onUsernameChange() {
    
    this.isUsernameChanged = true;
  }
}
