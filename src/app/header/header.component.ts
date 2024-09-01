import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'vf-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  router = inject(Router);
  isScrolled = false;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.isScrolled = scrollY >= 57;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
