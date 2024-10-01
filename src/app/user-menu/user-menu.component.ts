import { Component, HostListener, signal } from '@angular/core';
import { userMenuAnimation } from '../shared/animations';

@Component({
  selector: 'vf-user-menu',
  standalone: true,
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  animations: [userMenuAnimation],
})
export class UserMenuComponent {
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
}
