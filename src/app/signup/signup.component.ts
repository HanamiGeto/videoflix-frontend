import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { customEmailValidator, matchPasswordValidator } from '../validators';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'vf-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormErrorsComponent,
    RouterLink,
    FooterComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

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
    password_confirm: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, matchPasswordValidator],
    }),
  });

  onSubmit() {
    const formValue = this.form.getRawValue();
    if (this.form.valid) {
      this.authService.signup(formValue).subscribe((data) => {
        this.router.navigate(['/login']);
        console.log(data);
      });
    }
  }
}
