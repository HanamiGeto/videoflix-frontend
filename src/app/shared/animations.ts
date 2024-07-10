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
          'translateX({{translateXValue}}px) translateY({{translateYValue}}px) scaleX({{scaleXValue}}) scaleY({{scaleYValue}})',
      }),
      query('@onHoverChild', animateChild()),
      animate(
        '100ms ease-in',
        style({
          transform: 'translateX(0px) translateY(0px) scaleX(1) scaleY(1)',
        }),
      ),
    ]),

    transition(':leave', [
      query('@onHoverChild', animateChild()),
      animate(
        '200ms ease-in',
        style({
          transform:
            'translateX({{translateXValue}}px) translateY({{translateYValue}}px) scaleX({{scaleXValue}}) scaleY({{scaleYValue}})',
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

export const routeTransition = [
  trigger('routeTransition', [
    transition('* => *', [
      query(':enter', [style({ opacity: 0, scale: 1 })], { optional: true }),
      query(':leave', [animate('750ms'), style({ opacity: 0, scale: 1.1 })], {
        optional: true,
      }),
      query(':leave', [animate('1ms'), style({ opacity: 1, scale: 1 })], {
        optional: true,
      }),
    ]),
  ]),
];
