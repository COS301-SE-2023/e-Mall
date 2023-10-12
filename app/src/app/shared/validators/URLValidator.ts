import { FormControl } from '@angular/forms';

// URL validation regex
const urlPattern = '^(https?://)[\\da-z.-]+\\.[a-z.]{2,6}[/\\w .-]*/?$';
export function UrlValidator(control: FormControl) {
  if (!control.value) {
    // the field is empty
    return null;
  }

  // test url against the pattern
  const isValid = new RegExp(urlPattern).test(control.value);

  return isValid ? null : { url: { value: control.value } };
}
