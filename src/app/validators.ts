import { ValidatorFn } from '@angular/forms';

export const customEmailValidator: ValidatorFn = function (control) {
  if (!control.value) {
    return null;
  }

  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  if (!emailPattern.test(control.value?.toLowerCase())) {
    return { invalidemail: true };
  }
  return null;
};
