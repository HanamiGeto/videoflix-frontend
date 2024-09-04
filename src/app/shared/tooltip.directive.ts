import {
  ComponentRef,
  Directive,
  effect,
  HostListener,
  inject,
  input,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Directive({
  selector: '[vfTooltip]',
  standalone: true,
})
export class TooltipDirective {
  tooltip = input.required<string>({ alias: 'vfTooltip' });
  private viewContainer = inject(ViewContainerRef);
  private hover = signal(false);
  private rectLeft = 0;
  private rectTop = 0;
  private tooltipRef: ComponentRef<TooltipComponent> | null = null;

  @HostListener('mouseenter') onMouseEnter() {
    this.hover.set(true);
    this.getRectPosition();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover.set(false);
    this.tooltipRef = null;
  }

  constructor() {
    effect(() => {
      if (this.hover()) {
        this.updateToolTip();
      } else {
        this.viewContainer.clear();
      }
    });
  }

  getRectPosition() {
    const hostElem = this.viewContainer.element.nativeElement;
    const rect = hostElem.getBoundingClientRect();
    this.rectLeft = rect.left;
    this.rectTop = rect.top;
  }

  updateToolTip() {
    if (!this.tooltipRef) {
      this.tooltipRef = this.viewContainer.createComponent(TooltipComponent);
    }
    this.tooltipRef.setInput('tooltip', this.tooltip());
    this.tooltipRef.instance.left = this.rectLeft + 20;
    this.tooltipRef.instance.top = this.rectTop - 42;
  }
}
