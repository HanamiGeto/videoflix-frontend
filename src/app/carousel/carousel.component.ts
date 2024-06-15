import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
} from '@angular/core';
import Swiper from 'swiper/bundle';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';

@Component({
  selector: 'vf-carousel',
  standalone: true,
  imports: [PreviewModalComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  animations: [
    trigger('onHover', [
      transition(':enter', [
        style({
          transform:
            'translateX(-61px) translateY(21px) scaleX(0.715) scaleY(0.63) translateZ(0px)',
        }),
        group([
          query('@onHoverChild', animateChild()),
          animate(
            '150ms 450ms ease-in',
            style({
              transform:
                'translateX(0px) translateY(1.4964px) scaleX(1) scaleY(1) translateZ(0px)',
            }),
          ),
        ])
      ]),
      transition(':leave', [
        group([
          query('@onHoverChild', animateChild()),
          animate(
            '250ms ease-in',
            style({
              transform:
                'translateX(-61px) translateY(21px) scaleX(0.715) scaleY(0.63) translateZ(0px)',
            }),
          ),
        ])
      ])
    ]),
    trigger('onHoverChild', [
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate('150ms 450ms ease-in', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0}))
      ])
    ])
  ],
})
export class CarouselComponent {
  @ViewChild('swiper') private swiper!: ElementRef;
  showPreviewOnHover = false;

  constructor() {
    afterNextRender(() => {
      return new Swiper(this.swiper.nativeElement, {
        slidesPerView: 6,
        slidesPerGroup: 6,
        loop: true,
        spaceBetween: 5,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      });
    });
  }
}
