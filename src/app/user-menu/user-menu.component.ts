import { Component, HostListener, inject, signal } from '@angular/core';
import { userMenuAnimation } from '../shared/animations';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'vf-user-menu',
  standalone: true,
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  animations: [userMenuAnimation],
})
export class UserMenuComponent {
  private authService = inject(AuthService);
  userMenuActive = signal(false);
  private debounceTimeout?: ReturnType<typeof setTimeout>;

  @HostListener('mouseenter') onMouseEnter() {
    this.userMenuActive.set(true);
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.debounceTimeout = setTimeout(() => {
      this.userMenuActive.set(false);
    }, 250);
  }

  clearTime() {
    clearTimeout(this.debounceTimeout);
  }

  logout() {
    this.authService.logout();
  }
}
