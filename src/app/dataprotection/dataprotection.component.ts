import { Component, inject } from '@angular/core';
import { Location, ViewportScroller } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'vf-dataprotection',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './dataprotection.component.html',
  styleUrl: './dataprotection.component.scss',
})
export class DataprotectionComponent {
  private location = inject(Location);
  private viewportScroller = inject(ViewportScroller);

  backClicked() {
    this.location.back();
  }

  scrollTo(event: Event, fragment: string) {
    event.preventDefault();
    this.viewportScroller.scrollToAnchor(fragment);
  }
}
