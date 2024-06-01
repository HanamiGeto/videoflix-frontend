import { Component, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'vf-form-errors',
  standalone: true,
  imports: [],
  templateUrl: './form-errors.component.html',
  styleUrl: './form-errors.component.scss',
})
export class FormErrorsComponent {
  private form = inject(FormGroupDirective);
  controlName = input.required<string>();
  messages = input.required<{ [errorCode: string]: string }>();

  get errors(): string[] {
    if (!this.controlName) {
      return [];
    }

    const control = this.form.control.get(this.controlName());

    if (!control || !control.errors || !control.touched) {
      return [];
    }

    return Object.keys(control.errors).map((errorCode) => {
      return this.messages()[errorCode];
    });
  }
}
