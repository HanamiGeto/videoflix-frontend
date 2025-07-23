import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'vf-imprint',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent {
  private location = inject(Location);

  backClicked() {
    this.location.back();
  }
}
