import { Component, inject } from '@angular/core';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { customEmailValidator } from '../validators';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'vf-forgot-password',
  standalone: true,
  imports: [
    FormErrorsComponent,
    ReactiveFormsModule,
    RouterLink,
    FooterComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, customEmailValidator],
    }),
  });

  onSubmit() {
    const formValue = this.form.getRawValue();
    if (this.form.valid) {
      this.authService.requestPasswordReset(formValue).subscribe(() => {
        console.log(formValue);
      });
    }
  }
}
