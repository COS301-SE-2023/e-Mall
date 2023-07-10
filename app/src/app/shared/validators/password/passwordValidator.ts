//check if password and confim password match
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function passwordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  const errors: ValidationErrors = {};

  if (Validators.required(control)) {
    errors['required'] = true;
  }

  if (Validators.minLength(8)(control) || value.length === 0) {
    errors['minlength'] = { requiredLength: 8 };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
    errors['mixedCase'] = true;
  }

  if (!/(?=.*\d)/.test(value)) {
    errors['number'] = true;
  }

  if (!/(?=.*[!@#?\]])/.test(value)) {
    errors['specialCharacter'] = true;
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

export function passwordMatchValidator(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get(controlName);
    const confirmPassword = formGroup.get(matchingControlName);

    if (!password || !confirmPassword) {
      return { missingControl: true };
    }

    if (confirmPassword.errors && !confirmPassword.errors['matching']) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ matching: true });
    } else {
      confirmPassword.setErrors(null);
    }
    return null;
  };
}

export const passwordValidationErrors = {
  password: [
    {
      type: 'minlength',
      message: 'Must be at least 8 characters long',
    },
    {
      type: 'mixedCase',
      message: 'Must contain at least one upper and lower case character',
    },
    {
      type: 'number',
      message: 'Must contain at least on number',
    },
    {
      type: 'specialCharacter',
      message: 'Must contain at least one special character',
    },
  ],
  confirmPassword: [
    { type: 'required', message: 'Confirm password is required' },
    {
      type: 'matching',
      message: 'Password does not match',
    },
  ],
};
