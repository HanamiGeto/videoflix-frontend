import { Component, inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'vf-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
