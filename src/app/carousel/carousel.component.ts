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
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import Swiper from 'swiper/bundle';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { VideoUrlPipe } from '../shared/video-url.pipe';
import { Observable, switchMap } from 'rxjs';
import { Video } from '../shared/video';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vf-carousel',
  standalone: true,
  imports: [PreviewModalComponent, VideoUrlPipe, AsyncPipe, RouterLink],
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
        ]),
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
        ]),
      ]),
    ]),
    trigger('onHoverChild', [
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate('150ms 450ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CarouselComponent {
  swiper = viewChild<ElementRef>('swiper');
  showPreviewOnHover = false;
  hoveredVideoId = signal(0);
  videos = toSignal(inject(VideoService).getAll());
  private videoService = inject(VideoService);
  // video = toSignal(inject(VideoService).getSingle(this.hoveredVideoId));

  constructor() {
    effect(() => {
      if (this.videos()) {
        this.initializeSwiper();
      }
    });
  }

  initializeSwiper(): void {
    if (this.swiper()) {
      new Swiper(this.swiper()!.nativeElement, {
        slidesPerView: 6,
        slidesPerGroup: 6,
        loop: true,
        spaceBetween: 6,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      });
    }
  }

  getVideoIdOnHover(videoId: number): void {
    this.hoveredVideoId.set(videoId);
    this.showPreviewOnHover = true;
  }

  video$: Observable<Video> = toObservable(this.hoveredVideoId).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
  );
}
