import {
  animate,
  animateChild,
  query,
  state,
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

export const searchFieldTransition = [
  trigger('searchFieldTransition', [
    transition(':enter', [
      style({ width: 0 + 'px' }),
      animate('350ms ease-out'),
    ]),
  ]),
];

export const toastAnimation = [
  trigger('toastTrigger', [
    state('void', style({ transform: 'translateY(100%)' })),
    state('*', style({ transform: 'translateY(0)' })),

    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate('300ms ease-in-out'),
    ]),

    transition(':leave', [
      animate('300ms ease-in-out', style({ transform: 'translateY(100%)' })),
    ]),
  ]),
];

export const videoListAnimation = [
  trigger('parent', [
    transition(':enter', [
      query('@videoAnimation', animateChild(), { optional: true }),
    ]),
    transition(':leave', [
      query('@videoAnimation', animateChild(), { optional: true }),
    ]),
  ]),

  trigger('videoAnimation', [
    transition('* => shift', [
      animate('500ms ease-out', style({ transform: 'translateX(-102%)' })),
    ]),
    transition('shift => *', [
      animate('500ms ease-out', style({ transform: 'translateX(102%)' })),
    ]),
    transition('void => removed, void => nextRowRemoved', [
      style({ opacity: 0, scale: 0.95 }),
      animate('500ms ease-in-out', style({ opacity: 1, scale: 1 })),
    ]),
    transition(':leave', [
      animate('200ms ease-in-out', style({ opacity: 0, scale: 0.95 })),
      animate('300ms', style({ opacity: 0 })),
    ]),
  ]),
];
