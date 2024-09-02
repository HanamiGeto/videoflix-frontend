import { Component, input } from '@angular/core';

@Component({
  selector: 'vf-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  tooltip = input<string>();
  left = 0;
  top = 0;
}
