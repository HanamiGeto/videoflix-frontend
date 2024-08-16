import {
  Component,
  effect,
  ElementRef,
  HostListener,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { searchFieldTransition } from '../shared/animations';

@Component({
  selector: 'vf-search',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  animations: [searchFieldTransition],
})
export class SearchComponent {
  openSearch = signal(false);
  private wasInside = false;
  private searchInput = viewChild<ElementRef>('searchInput');

  @HostListener('click', ['$event'])
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('window:click', ['$event'])
  clickout() {
    if (!this.wasInside) {
      this.openSearch.set(false);
    }
    this.wasInside = false;
  }

  constructor() {
    effect(() => {
      if (this.openSearch()) {
        this.searchInput()?.nativeElement.focus();
      }
    });
  }
}
