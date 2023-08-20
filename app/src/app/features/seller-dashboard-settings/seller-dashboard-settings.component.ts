import { Component, OnInit } from '@angular/core';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
//import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
//import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-seller-dashboard-settings',
  templateUrl: './seller-dashboard-settings.component.html',
  styleUrls: ['./seller-dashboard-settings.component.scss']
})
export class SellerDashboardSettingsComponent implements OnInit{

 // @ViewChild(IonContent)
 // content!: IonContent;
  
  sellerProfileForm: FormGroup;
  isUsernameChanged = false;
  profile$: Observable<ISellerProfile | null>;

  constructor(
    public profileFacade: ProfileFacade,
    private formBuilder: FormBuilder,
    private router: Router
  ) 
  {
    this.sellerProfileForm = new FormGroup({
      username: new FormControl(),
      name: new FormControl(),
      support_email: new FormControl(),
      phoneNumber: new FormControl(),
      address: new FormControl(),
      city: new FormControl(),
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
          twitter: profile.details.twitter_link,
          facebook: profile.details.facebook_link,
          instagram: profile.details.instagram_link,
          website: profile.details.website,
          postcode: profile.details.postal_code,
          city: profile.details.city,
          address: profile.details.address,
          phoneNumber: profile.details.landline_number,
          support_email: profile.details.support_email,
          //name: profile.details.business_name,

        });
      }
    });
  }

  onSubmit() {
    this.profileFacade.updateProfile({
      username: this.sellerProfileForm.value.username,
      details: {
        twitter_link: this.sellerProfileForm.value.twitter,
        facebook_link: this.sellerProfileForm.value.facebook,
        instagram_link: this.sellerProfileForm.value.instagram,
        website: this.sellerProfileForm.value.website,
        postal_code: this.sellerProfileForm.value.postcode,
        city: this.sellerProfileForm.value.city,
        address: this.sellerProfileForm.value.address,
        landline_number: this.sellerProfileForm.value.phoneNumber,
        support_email: this.sellerProfileForm.value.support_email
      }

    });

    
    this.router.navigate(['/seller-dashboard-settings']);
  }

  onUsernameChange() {
    
    this.isUsernameChanged = true;
  }
}
