import { Component, inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { customEmailValidator } from '../validators';
import { FormErrorsComponent } from '../form-errors/form-errors.component';

@Component({
  selector: 'vf-landing-page',
  standalone: true,
  imports: [FooterComponent, FormErrorsComponent, ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
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
      // this.authService.signup(formValue).subscribe((data) => {
      //  this.router.navigate(['/login']);
      //  console.log(data);
      // });
      console.log(formValue);
    }
  }
}
