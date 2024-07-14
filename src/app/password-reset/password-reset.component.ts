import { Component, inject, input } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { matchPasswordValidator } from '../validators';

@Component({
  selector: 'vf-password-reset',
  standalone: true,
  imports: [FormErrorsComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  token = input.required<string>();

  form = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    password_confirm: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, matchPasswordValidator],
    }),
  });

  onSubmit() {
    const formValue = { ...this.form.getRawValue(), token: this.token() };
    if (this.form.valid) {
      this.authService.passwordReset(formValue).subscribe(() => {
        console.log(formValue);
      });
    }
  }
}
