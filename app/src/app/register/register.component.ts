import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISellerForm } from '@app/models/seller.interface';
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  loading: boolean;
  isConfirm: boolean;
  user: any;
  registerForm!: FormGroup;
  formSubmitted = false;
  // constructor(private router: Router, ) {
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.loading = false;
    this.isConfirm = false;
    this.user = { showPassword: false };
    // this.user = {} as ISellerForm;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        cpassword: ['', Validators.required],
        Website: ['', Validators.required],
        feed: [''],
        typeOfBusiness: ['', Validators.required],
        catalogSize: ['', Validators.required],
        sizeOfBusiness: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    // Handle form submission
    if (this.registerForm.valid) {
      console.log('Form submitted');
      //console.log(this.registerForm.value);
      this.router.navigate(['/pending']);
    } else {
      console.log('Form is invalid!');
      this.formSubmitted = true;
    }
  }

  //check if password and confim password match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const cpassword = formGroup.get('cpassword')?.value;

    if (password !== cpassword) {
      formGroup.get('cpassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('cpassword')?.setErrors(null);
    }
  }

  public signUp(): void {
    //      this.loading = true;
    const data: ISellerForm = {
      username: 'test2',
      email: 'test2@test.com',
      type: 'seller',
      reg_no: '123456023452',
      business_name: 'Test2 Business',
      business_type: 'Test Type',
      catalogue_size: 200,
      business_category: 'MICRO',
      status: 'PENDING',
      is_verified: false,
      website: 'https://www.bing1.com/',
      feed_url: 'https://www.bing1.com/',
      password: '!Q2w3e4r!',
    };
    this.authService.sellerSignUp(data);
    //     this.authService.sellerSignUp(data).subscribe(data => {
    //       console.log('hiiiiiiiiiiiii');
    //       console.log(data);
    //     });
    this.router.navigate(['/pending']);
  }

  /* public confirmSignUp(): void {
    this.loading = true;
    this.cognitoService
      .confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/register2']);
      })
      .catch(() => {
        this.loading = false;
      });
  }*/
}
