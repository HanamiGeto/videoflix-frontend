import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { customEmailValidator } from '../validators';
import { RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'vf-registration',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorsComponent, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  private authService = inject(AuthService);

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, customEmailValidator],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  onSubmit() {
    const formValue = this.form.getRawValue();
    // console.log(formValue)
    this.authService.register(formValue);
  }
}
