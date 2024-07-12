import { Component, inject } from '@angular/core';
import { ChildrenOutletContexts, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { routeTransition } from './shared/animations';

@Component({
  selector: 'vf-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [routeTransition],
})
export class AppComponent {
  title = 'videoflix';
  private router = inject(Router);
  private contexts = inject(ChildrenOutletContexts);

  shouldDisplayFooter(): boolean {
    const url = this.router.url;
    return !this.isBrowseOrWatchRoute(url);
  }

  private isBrowseOrWatchRoute(url: string): boolean {
    const browseRoute = '/browse';
    const watchRoutePattern = /^\/watch\/\d+$/;

    return url === browseRoute || watchRoutePattern.test(url);
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
