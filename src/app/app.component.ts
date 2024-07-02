import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'vf-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'videoflix';
  router = inject(Router);

  shouldDisplayFooter(): boolean {
    const url = this.router.url;
    return !(url === '/browse' || '/watch/:id');
  }
}
