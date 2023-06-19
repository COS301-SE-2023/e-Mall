import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISellerForm } from '@app/models/seller/seller.interface';
import { AuthService } from '@app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.scss'],
})
export class SellerRegisterComponent implements OnInit {
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
        website: ['', Validators.required],
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
      // this.router.navigate(['/pending'])
      this.signUp();
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
  private getFormValue(field: string) {
    return this.registerForm.controls[field].value;
  }
  public signUp(): void {
    //      this.loading = true;
    const data: ISellerForm = {
      // username: this.getFormValue('email').split('@')[0],
      email: this.getFormValue('email'),
      type: 'seller',
      // reg_no: '123456023452',
      // business_name: 'Test2 Business',
      business_type: this.getFormValue('typeOfBusiness'),
      catalogue_size: this.getFormValue('catalogSize'),
      no_employees: this.getFormValue('sizeOfBusiness'),
      // status: 'PENDING',
      // is_verified: false,
      website: this.getFormValue('website'),
      feed_url: this.getFormValue('feed'),
      password: this.getFormValue('password'),
    };
    // this.authService.sellerSignUp(data);
    this.authService.sellerSignUp(data).subscribe(data => {
      console.log('data: ', data);
      this.router.navigate(['/pending']);
    });
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
