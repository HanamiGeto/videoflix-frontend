import { Component, inject } from '@angular/core';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { customEmailValidator } from '../validators';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'vf-login',
  standalone: true,
  imports: [FormErrorsComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
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
    if (this.form.valid) {
      this.authService.login(formValue).subscribe(() => {
        if (this.authService.isAuthenticated()) {
          this.router.navigate(['/browse']);
        }
      });
    }
  }
}
