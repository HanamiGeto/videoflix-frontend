import {
  animate,
  animateChild,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const previewModalAnimation = [
  trigger('onHover', [
    transition(':enter', [
      style({
        transform:
          'translateX(-61px) translateY(21px) scaleX(0.715) scaleY(0.63) translateZ(0px)',
      }),
      query('@onHoverChild', animateChild()),
      animate(
        '100ms ease-in',
        style({
          transform:
            'translateX(0px) translateY(1.4964px) scaleX(1) scaleY(1) translateZ(0px)',
        }),
      ),
    ]),
    transition(':leave', [
      query('@onHoverChild', animateChild()),
      animate(
        '200ms ease-in',
        style({
          transform:
            'translateX(-61px) translateY(21px) scaleX(0.715) scaleY(0.63) translateZ(0px)',
        }),
      ),
    ]),
  ]),
  trigger('onHoverChild', [
    transition(':enter', [
      style({
        opacity: 0,
      }),
      animate('100ms ease-in', style({ opacity: 1 })),
    ]),
    transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
  ]),
];
